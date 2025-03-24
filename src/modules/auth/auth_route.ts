import express from "express";
import { AuthControllers } from "./auth_controller";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth_validaionZodSchema";

const router = express.Router();

// login user .
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationZodSchema),
  AuthControllers.loginUser
);

export const AuthRoutes = router;
