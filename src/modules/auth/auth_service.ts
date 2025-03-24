import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { User } from "../users/user_model";
import { TJwtPayload, TLoginUser } from "./auth_interface";
import { createToken } from "./auth_utils";
import config from "../../config";

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

export const AuthServices = { loginUser };
