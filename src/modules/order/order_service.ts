import { JwtPayload } from "jsonwebtoken";
import { TOrder } from "./order_interface";

// create order into db.
const createOrderIntoDB = async (user: JwtPayload, payload: TOrder) => {
  console.log(payload);
};

export const OrderServices = { createOrderIntoDB };
