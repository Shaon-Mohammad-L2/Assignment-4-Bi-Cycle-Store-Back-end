import express from "express";
import { PaymentControllers } from "./payment_controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/success", PaymentControllers.successPayment);

export const PaymentRoutes = router;
