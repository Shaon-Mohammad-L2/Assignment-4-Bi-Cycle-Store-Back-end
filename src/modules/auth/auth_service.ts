import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { User } from "../users/user_model";
import { TJwtPayload, TLoginUser } from "./auth_interface";
import {
  createToken,
  generateEmailTemplate,
  generateOTP,
  hideEmailAfterSentOtp,
  verifyToken,
} from "./auth_utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { PasswordReset } from "./auth_model";
import { TEmailFormate } from "../../interface/emailFormat";
import sendEmail from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  //checking if the user is exits in the database.
  const user = await User.isUserAlreadyExistsBy_email(payload.email);
  if (!user) {
    throw new AppError(404, "This user is not found!");
  }

  //checking if the user is already deleted.
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(403, "This user is deleted!");
  }

  //checking if the user is blocked.
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(403, "This user is Blocked");
  }

  // checking user password mached or not.
  const isPasswordMached = await User.isPasswordMached(
    payload.password,
    user.password
  );
  if (!isPasswordMached) {
    throw new AppError(403, "Password is incorrect!");
  }

  // set jwt payload.
  const jwtPayload: TJwtPayload = {
    user_id: user._id as Types.ObjectId,
    role: user.role,
  };

  // create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );
  // create refresh token.
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string
  );

  return { accessToken, refreshToken };
};

// user change password into db.
const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  //checking if the user is exist in the database.
  const _id = userData?.user_id;
  const user = await User.findOne({ _id, role: userData?.role }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(404, "This user is not found!");
  }

  //checking if the user is already deleted .
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(403, "This user is already deleted!");
  }

  //checkign if the user is blocked.
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(403, "This user is blocked!");
  }

  //checking if the password is matched or not.
  const isPasswordMached = await User.isPasswordMached(
    payload.oldPassword,
    user.password
  );
  if (!isPasswordMached) {
    throw new AppError(400, "Old password is incorrect!");
  }

  // Ensure the new password is different from the old password
  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      400,
      "New password cannot be the same as the old password!"
    );
  }

  // set new password.
  user.password = payload.newPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  // set jwt payload for token.
  const jwtPayload: TJwtPayload = {
    user_id: user._id as Types.ObjectId,
    role: user.role,
  };

  // create a access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );

  //create a refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string
  );

  //return access and refresh token.
  return { accessToken, refreshToken };
};

// create access token by refresh token.
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, "You are not authorized");
  }

  // check if the token is valid.
  const decoded = verifyToken(token, config.jwt_refresh_token_secret as string);

  const { user_id, iat } = decoded;
  //checking if the user is exist in the database
  const user = await User.isUserAlreadyExistsBy_id(user_id);
  if (!user) {
    throw new AppError(404, "This user is not found!");
  }

  // checking if the user is alrady deleted.
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(403, "This user is deleted!");
  }
  // checking if the user is blocked
  const userStatus = user.status;
  if (userStatus === "blocked") {
    throw new AppError(403, "This user is blocked!");
  }

  // checking if the password change time.
  if (user.passwordChangedAt) {
    const isPasswordChanged = User.isJWTIssuedAtBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number
    );
    if (isPasswordChanged) {
      throw new AppError(401, "You are not authorized!");
    }
  }

  // set jwt payload for token.
  const jwtPayload: TJwtPayload = {
    user_id: user._id as Types.ObjectId,
    role: user.role,
  };

  // create a access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );

  return accessToken;
};

//forgot password .
const forgotPassword = async (payload: { email: string }) => {
  // checking this user exists in database.
  const user = await User.isUserAlreadyExistsBy_email(payload.email);
  if (!user) {
    throw new AppError(404, "This user is not found!");
  }

  //checking if the user is already deleted.
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(403, "This user is deleted!");
  }

  //checking if the user is blocked.
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(403, "This user is Blocked");
  }

  let passwordResetModel = await PasswordReset.findOne({
    email: user.email,
  });

  if (!passwordResetModel) {
    passwordResetModel = await PasswordReset.create({ email: payload.email });
  }
  // Check if the user is locked out from requesting OTP
  if (
    passwordResetModel.otpRequestLockUntil &&
    passwordResetModel.otpRequestLockUntil > new Date()
  ) {
    throw new AppError(
      429,
      "Too many OTP requests. Please try again after 1 hour."
    );
  }

  // Check the OTP request count within the last 10 minutes
  if (
    passwordResetModel.otpRequestCount &&
    passwordResetModel.otpRequestCount >= 3 &&
    passwordResetModel.resetPasswordOTPExpires &&
    passwordResetModel.resetPasswordOTPExpires > new Date()
  ) {
    passwordResetModel.otpRequestLockUntil = new Date(
      Date.now() + 60 * 60 * 1000
    ); // Lock for 1 hour
    passwordResetModel.otpRequestCount = 0;
    await passwordResetModel.save();
    throw new AppError(
      429,
      "Too many OTP requests. Please try again after 1 hour."
    );
  }

  // checking already send otp

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  passwordResetModel.resetPasswordOTP = otp;
  passwordResetModel.resetPasswordOTPExpires = otpExpires;

  // Increment OTP request count or reset it if the previous OTP expired
  if (
    !passwordResetModel.otpRequestCount ||
    !passwordResetModel.resetPasswordOTPExpires ||
    passwordResetModel.resetPasswordOTPExpires < new Date()
  ) {
    passwordResetModel.otpRequestCount = 1; // Reset count after OTP expiry
  } else {
    passwordResetModel.otpRequestCount += 1;
  }

  await passwordResetModel.save();

  const htmlBody = generateEmailTemplate(otp);

  const emailTemplete: TEmailFormate = {
    emailBody: htmlBody,
    subject: "Your Verification Code",
    text: `Your verification code is: ${otp}`,
  };

  await sendEmail(payload.email, emailTemplete);

  const emailHints = hideEmailAfterSentOtp(payload.email);

  return {
    message: `A verification code has been sent to ${emailHints}. Please check your inbox.`,
  };
};

export const AuthServices = {
  loginUser,
  changePasswordIntoDB,
  refreshToken,
  forgotPassword,
};
