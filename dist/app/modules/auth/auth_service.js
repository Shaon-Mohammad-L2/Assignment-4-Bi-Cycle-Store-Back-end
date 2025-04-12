"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../users/user_model");
const auth_utils_1 = require("./auth_utils");
const config_1 = __importDefault(require("../../config"));
const auth_model_1 = require("./auth_model");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if the user is exits in the database.
    const user = yield user_model_1.User.isUserAlreadyExistsBy_email(payload.email);
    if (!user) {
        throw new AppError_1.default(404, "This user is not found!");
    }
    //checking if the user is already deleted.
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(403, "This user is deleted!");
    }
    //checking if the user is blocked.
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "blocked") {
        throw new AppError_1.default(403, "This user is Blocked");
    }
    // checking user password mached or not.
    const isPasswordMached = yield user_model_1.User.isPasswordMached(payload.password, user.password);
    if (!isPasswordMached) {
        throw new AppError_1.default(403, "Password is incorrect!");
    }
    // set jwt payload.
    const jwtPayload = {
        user_id: user._id,
        role: user.role,
    };
    // create access token
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    // create refresh token.
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expires_in);
    return { accessToken, refreshToken };
});
// user change password into db.
const changePasswordIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if the user is exist in the database.
    const _id = userData === null || userData === void 0 ? void 0 : userData.user_id;
    const user = yield user_model_1.User.findOne({ _id, role: userData === null || userData === void 0 ? void 0 : userData.role }).select("+password");
    if (!user) {
        throw new AppError_1.default(404, "This user is not found!");
    }
    //checking if the user is already deleted .
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(403, "This user is already deleted!");
    }
    //checkign if the user is blocked.
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "blocked") {
        throw new AppError_1.default(403, "This user is blocked!");
    }
    //checking if the password is matched or not.
    const isPasswordMached = yield user_model_1.User.isPasswordMached(payload.oldPassword, user.password);
    if (!isPasswordMached) {
        throw new AppError_1.default(400, "Old password is incorrect!");
    }
    // Ensure the new password is different from the old password
    if (payload.oldPassword === payload.newPassword) {
        throw new AppError_1.default(400, "New password cannot be the same as the old password!");
    }
    // set new password.
    user.password = payload.newPassword;
    user.passwordChangedAt = new Date();
    yield user.save();
    // set jwt payload for token.
    const jwtPayload = {
        user_id: user._id,
        role: user.role,
    };
    // create a access token
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    //create a refresh token
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expires_in);
    //return access and refresh token.
    return { accessToken, refreshToken };
});
// create access token by refresh token.
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(401, "You are not authorized");
    }
    // check if the token is valid.
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_token_secret);
    const { user_id, iat } = decoded;
    //checking if the user is exist in the database
    const user = yield user_model_1.User.isUserAlreadyExistsBy_id(user_id);
    if (!user) {
        throw new AppError_1.default(404, "This user is not found!");
    }
    // checking if the user is alrady deleted.
    const isDeleted = user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(403, "This user is deleted!");
    }
    // checking if the user is blocked
    const userStatus = user.status;
    if (userStatus === "blocked") {
        throw new AppError_1.default(403, "This user is blocked!");
    }
    // checking if the password change time.
    if (user.passwordChangedAt) {
        const isPasswordChanged = user_model_1.User.isJWTIssuedAtBeforePasswordChanged(user.passwordChangedAt, iat);
        if (isPasswordChanged) {
            throw new AppError_1.default(401, "You are not authorized!");
        }
    }
    // set jwt payload for token.
    const jwtPayload = {
        user_id: user._id,
        role: user.role,
    };
    // create a access token
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    return accessToken;
});
//forgot password .
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking this user exists in database.
    const user = yield user_model_1.User.isUserAlreadyExistsBy_email(payload.email);
    if (!user) {
        throw new AppError_1.default(404, "This user is not found!");
    }
    //checking if the user is already deleted.
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(403, "This user is deleted!");
    }
    //checking if the user is blocked.
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === "blocked") {
        throw new AppError_1.default(403, "This user is Blocked");
    }
    let passwordResetModel = yield auth_model_1.PasswordReset.findOne({
        email: user.email,
    });
    if (!passwordResetModel) {
        passwordResetModel = yield auth_model_1.PasswordReset.create({ email: payload.email });
    }
    // Check if the user is locked out from requesting OTP
    if (passwordResetModel.otpRequestLockUntil &&
        passwordResetModel.otpRequestLockUntil > new Date()) {
        throw new AppError_1.default(429, "Too many OTP requests. Please try again after 1 hour.");
    }
    // Check the OTP request count within the last 10 minutes
    if (passwordResetModel.otpRequestCount &&
        passwordResetModel.otpRequestCount >= 3 &&
        passwordResetModel.resetPasswordOTPExpires &&
        passwordResetModel.resetPasswordOTPExpires > new Date()) {
        passwordResetModel.otpRequestLockUntil = new Date(Date.now() + 60 * 60 * 1000); // Lock for 1 hour
        passwordResetModel.otpRequestCount = 0;
        yield passwordResetModel.save();
        throw new AppError_1.default(429, "Too many OTP requests. Please try again after 1 hour.");
    }
    // checking already send otp
    const otp = (0, auth_utils_1.generateOTP)();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    passwordResetModel.resetPasswordOTP = otp;
    passwordResetModel.resetPasswordOTPExpires = otpExpires;
    // Increment OTP request count or reset it if the previous OTP expired
    if (!passwordResetModel.otpRequestCount ||
        !passwordResetModel.resetPasswordOTPExpires ||
        passwordResetModel.resetPasswordOTPExpires < new Date()) {
        passwordResetModel.otpRequestCount = 1; // Reset count after OTP expiry
    }
    else {
        passwordResetModel.otpRequestCount += 1;
    }
    yield passwordResetModel.save();
    const htmlBody = (0, auth_utils_1.generateEmailTemplate)(otp);
    const emailTemplete = {
        emailBody: htmlBody,
        subject: "Your Verification Code",
        text: `Your verification code is: ${otp}`,
    };
    yield (0, sendEmail_1.default)(payload.email, emailTemplete);
    const emailHints = (0, auth_utils_1.hideEmailAfterSentOtp)(payload.email);
    return {
        message: `A verification code has been sent to ${emailHints}. Please check your inbox.`,
    };
});
// verify OTP
const verifyOTP = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking this user exists in database.
    const passwordResetModel = yield auth_model_1.PasswordReset.findOne({
        email: payload.email,
    });
    if (!passwordResetModel) {
        throw new AppError_1.default(404, "Email not found.");
    }
    // Check if the OTP has expired
    if (passwordResetModel.resetPasswordOTPExpires &&
        passwordResetModel.resetPasswordOTPExpires < new Date()) {
        throw new AppError_1.default(400, "OTP has expired.");
    }
    // Check if the user is blocked due to too many invalid attempts
    if (passwordResetModel.otpLockUntil &&
        passwordResetModel.otpLockUntil > new Date()) {
        throw new AppError_1.default(429, "Too many invalid OTP attempts. Please try again after 1 hour.");
    }
    // Validate the OTP
    if (passwordResetModel.resetPasswordOTP !== payload.otp) {
        // Increment invalid OTP attempts
        passwordResetModel.invalidOtpAttempts =
            (passwordResetModel.invalidOtpAttempts || 0) + 1;
        // Lock the user for 1 hour if they exceed 10 invalid attempts
        if (passwordResetModel.invalidOtpAttempts >= 6) {
            passwordResetModel.otpLockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1-hour lock
            passwordResetModel.invalidOtpAttempts = 0; // Reset invalid attempts after lock
        }
        yield passwordResetModel.save();
        throw new AppError_1.default(400, "Invalid OTP.");
    }
    // OTP is valid, mark it as verified and reset invalid attempt counters
    passwordResetModel.isOTPVerified = true;
    yield passwordResetModel.save();
    return;
});
//reset Password .
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordResetModel = yield auth_model_1.PasswordReset.findOne({
        email: payload.email,
    });
    if (!passwordResetModel || !passwordResetModel.isOTPVerified) {
        throw new AppError_1.default(400, "OTP not verified.");
    }
    const newPasswordHashed = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // set new password
    const user = yield user_model_1.User.findOneAndUpdate({ email: payload.email }, { password: newPasswordHashed, passwordChangedAt: new Date() }, { new: true });
    // Clean up reset token
    yield passwordResetModel.deleteOne({ email: payload.email });
    // set jwt payload.
    const jwtPayload = {
        user_id: user === null || user === void 0 ? void 0 : user._id,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    // create access token
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    // create refresh token.
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expires_in);
    return { accessToken, refreshToken };
});
exports.AuthServices = {
    loginUser,
    changePasswordIntoDB,
    refreshToken,
    forgotPassword,
    verifyOTP,
    resetPassword,
};
