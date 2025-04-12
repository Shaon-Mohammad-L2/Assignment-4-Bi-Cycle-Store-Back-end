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
exports.AuthControllers = void 0;
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth_service");
// user login contoller.
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //stored result.
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { accessToken, refreshToken } = result;
    //set refresh token in cookie.
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    });
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Login success!",
        data: {
            token: accessToken,
        },
    });
}));
//user change password.
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.changePasswordIntoDB(req.user, req.body);
    const { accessToken, refreshToken } = result;
    //set refresh token in cookie.
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 201,
        message: "Password changed successfully",
        data: {
            token: accessToken,
        },
    });
}));
//create user access token by refresh token.
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.refreshToken(req.cookies.refreshToken);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: "Token Created Successfully!",
        data: {
            token: result,
        },
    });
}));
// user forgot password.
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Please check your email and verify with 10 menutes!",
        data: result,
    });
}));
// user verifyOTP
const verifyOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.verifyOTP(req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "OTP verified successfully!",
        data: result,
    });
}));
//user resetPassword
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.resetPassword(req.body);
    const { accessToken, refreshToken } = result;
    //set refresh token in cookie.
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Password reset successfully!",
        data: {
            token: accessToken,
        },
    });
}));
exports.AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgotPassword,
    verifyOTP,
    resetPassword,
};
