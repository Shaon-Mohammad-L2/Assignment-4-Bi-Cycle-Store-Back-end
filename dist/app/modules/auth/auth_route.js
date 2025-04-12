"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth_controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validaionZodSchema_1 = require("./auth_validaionZodSchema");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
// login user .
router.post("/login", (0, validateRequest_1.default)(auth_validaionZodSchema_1.AuthValidation.loginValidationZodSchema), auth_controller_1.AuthControllers.loginUser);
//user  password change.
router.post("/change-password", (0, auth_1.default)("superAdmin", "admin", "user", "developer"), (0, validateRequest_1.default)(auth_validaionZodSchema_1.AuthValidation.changePasswordValidationZodSchema), auth_controller_1.AuthControllers.changePassword);
// create user access token by refresh token.
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validaionZodSchema_1.AuthValidation.refreshTokenCookiesValidationZodSchema), auth_controller_1.AuthControllers.refreshToken);
//user forgot password.
router.post("/forgot-password", (0, validateRequest_1.default)(auth_validaionZodSchema_1.AuthValidation.forgotPasswordValidationZodSchema), auth_controller_1.AuthControllers.forgotPassword);
// veridy otp.
router.post("/verify-otp", (0, validateRequest_1.default)(auth_validaionZodSchema_1.AuthValidation.verifyOTPValidationZodSchema), auth_controller_1.AuthControllers.verifyOTP);
// user reset password.
router.post("/reset-password", (0, validateRequest_1.default)(auth_validaionZodSchema_1.AuthValidation.resetPasswordValidationZodSchema), auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
