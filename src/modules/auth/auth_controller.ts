import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth_service";

// user login contoller.
const loginUser = catchAsync(async (req, res) => {
  //stored result.
  const result = await AuthServices.loginUser(req.body);

  const { accessToken, refreshToken } = result;

  //set refresh token in cookie.
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
    // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Login success!",
    data: {
      token: accessToken,
    },
  });
});

//user change password.
const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePasswordIntoDB(req.user, req.body);

  const { accessToken, refreshToken } = result;

  //set refresh token in cookie.
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
    // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
  sendResponse(res, {
    success: true,
    status: 201,
    message: "Password changed successfully",
    data: {
      token: accessToken,
      refreshToken,
    },
  });
});

//create user access token by refresh token.
const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthServices.refreshToken(req.cookies.refreshToken);

  sendResponse(res, {
    status: 201,
    success: true,
    message: "Token Created Successfully!",
    data: {
      token: result,
    },
  });
});

// user forgot password.
const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Please check your email and verify with 10 menutes!",
    data: result,
  });
});

// user verifyOTP
const verifyOTP = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOTP(req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "OTP verified successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  verifyOTP,
};
