import express from "express";
import { AuthControllers } from "./auth_controller";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth_validaionZodSchema";
import auth from "../../middleware/auth";

const router = express.Router();

// login user .
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationZodSchema),
  AuthControllers.loginUser
);

//user  password change.
router.post(
  "/change-password",
  auth("superAdmin", "admin", "user", "developer"),
  validateRequest(AuthValidation.changePasswordValidationZodSchema),
  AuthControllers.changePassword
);
export const AuthRoutes = router;
