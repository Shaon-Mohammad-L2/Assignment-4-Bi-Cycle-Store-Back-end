import express from "express";
import { PaymentControllers } from "./payment_controller";

const router = express.Router();

router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failedPayment);
router.post("/cancel", PaymentControllers.canceledPayment);
export const PaymentRoutes = router;
