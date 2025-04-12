import { Types } from "mongoose";

export type TOrderProducts = {
  productId: Types.ObjectId;
  quantity: number;
};

export type TOrder = {
  _id?: Types.ObjectId;
  orderID: string;
  user: Types.ObjectId;
  email: string;
  name: string;
  phone: string;
  location?: string;
  note?: string;
  paid: number;
  due: number;
  totalAmount: number;
  totalQuantity: number;
  currency: "BDT";
  payment: "Paid" | "Unpaid";
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
