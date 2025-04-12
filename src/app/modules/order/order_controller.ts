import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order_service";

// create order.
const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderIntoDB(req.user, req.body);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Your order created successfully",
    data: result,
  });
});

export const OrderController = { createOrder };
