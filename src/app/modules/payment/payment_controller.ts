import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment_service";

// success paymnent.
const successPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.successPayment(
    req.cookies.refreshToken,
    req.body,
  );

  return res.redirect(302, result);
});

// failed paymnent.
const failedPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.failedPayment(
    req.cookies.refreshToken,
    req.body,
  );

  return res.redirect(302, result!);
});

// canceled paymnent.
const canceledPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.canceledPayment(
    req.cookies.refreshToken,
    req.body,
  );

  return res.redirect(302, result!);
});

export const PaymentControllers = {
  successPayment,
  failedPayment,
  canceledPayment,
};
