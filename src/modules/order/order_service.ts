import { JwtPayload } from "jsonwebtoken";
import { TOrder } from "./order_interface";
import { Client } from "../client/client_model";
import AppError from "../../errors/AppError";
import { Types } from "mongoose";
import { Product } from "../product/product_model";
import { Order } from "./order_model";
import { generateOTP } from "../auth/auth_utils";

// create order into db.
const createOrderIntoDB = async (user: JwtPayload, payload: TOrder) => {
  const { client } = await Client.isUserAndClientInformationFindBy_id(
    user.user_id
  );

  if (!client) {
    throw new AppError(404, "This user is not found");
  }

  const productIds = payload.products.map(
    (id) => new Types.ObjectId(id.productId)
  );

  const isProductExist = await Product.find({
    _id: { $in: productIds },
  }).select("stock price costing currency name images");

  if (isProductExist.length !== productIds.length) {
    throw new AppError(400, "One or more products are not found!");
  }

  let totalQuantity = 0;
  let totalAmount = 0;

  for (const product of isProductExist) {
    const orderProduct = payload.products.find(
      (item) => item.productId.toString() === product._id.toString()
    );

    if (product.stock <= 0) {
      throw new AppError(400, `${product.name} is not available in stock!`);
    }

    if (orderProduct && product.stock < orderProduct.quantity) {
      throw new AppError(400, `${product.name} is not enough in stock!`);
    }

    totalAmount += Number(product.price) * Number(orderProduct?.quantity!);
    totalQuantity += Number(orderProduct?.quantity!);
  }

  const orderID = generateOTP();
  payload.totalAmount = totalAmount;
  payload.totalQuantity = totalQuantity;
  payload.user = client._id!;
  payload.email = payload.email ?? client.email;
  payload.name = payload.name ?? client.name;
  payload.phone = payload.phone ?? client.phone;
  payload.location = payload.location ?? client.location;
  payload.deliveryStatus = "pending";
  payload.currency = "BDT";
  payload.isDeleted = false;
  payload.orderID = orderID;

  if (payload.isFullPay) {
    // redirect to payment gateway.
  } else {
    payload.due = totalAmount;
    payload.paid = 0;
    payload.status = "success";
    payload.isFullPay = false;

    const result = (await Order.create(payload)).populate({
      path: "products.productId",
      select: "name images price",
    });

    // update product stock.
    for (const product of payload.products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: { stock: -product.quantity },
      });
    }

    return result;
  }
};

export const OrderServices = { createOrderIntoDB };
