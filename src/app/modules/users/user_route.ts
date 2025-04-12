import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user_zodValidationSchema";
import { UserControllers } from "./user_controller";

const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidation.createUserValidationZodSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
