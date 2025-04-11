import { Types } from "mongoose";

export type TTransaction = {
  order: Types.ObjectId;
  tran_id: string;
  total_amount: number;
  total_quantity: number;
  currency: "BDT";
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  shipping_method: "NO" | "Courier" | string;
  product_name: string[] | string;
  product_category: string;
  product_profile: string;
  payment: "Paid" | "Unpaid";
  val_id: string;
  card_type: string;
  bank_tran_id: string;
  payment_status: string;
  tran_date: string;
  card_issuer: string;
  card_issuer_country: string;
  verify_sign: string;
  verify_key: string;
  currency_amount: string;
  risk_title: string;
  status: "pending" | "success";
  deliveryStatus:
    | "pending"
    | "confrim"
    | "cancel"
    | "on-curiar"
    | "return"
    | "delivered";
  card_brand: string;
  isDeleted: boolean;
};
