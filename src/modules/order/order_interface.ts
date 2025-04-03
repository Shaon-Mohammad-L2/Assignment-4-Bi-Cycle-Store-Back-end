import { Types } from "mongoose";

type TOrderProducts = {
  productId: Types.ObjectId;
  quantity: number;
};

export type TOrder = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  email: string;
  name: string;
  phone: string;
  location?: string;
  note?: string;
  paid: number;
  due: number;
  totalAmount: number;
  products: TOrderProducts[];
  transactionId?: string | null;
  transaction?: Types.ObjectId | null;
  isFullPay: boolean;
  status: "pending" | "success";
  deliveryStatus:
    | "pending"
    | "confrim"
    | "cancel"
    | "on-curiar"
    | "return"
    | "delivered";
  isDeleted: boolean;
};
