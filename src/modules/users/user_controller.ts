import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user_service";

const createUser = catchAsync(async (req, res) => {
  // store result.
  const result = await UserServices.createUserIntoDB(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
  });
  sendResponse(res, {
    status: 201,
    success: true,
    message: "User is created Successfully",
    data: {
      token: accessToken,
    },
  });
});

export const UserControllers = {
  createUser,
};
