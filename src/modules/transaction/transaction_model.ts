import mongoose from "mongoose";
import { TTransaction } from "./transaction_interface";

const TransactionSchema = new mongoose.Schema<TTransaction>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    tran_id: { type: String, required: true },
    total_amount: { type: Number, required: true },
    total_quantity: { type: Number, required: true },
    currency: { type: String, enum: ["BDT"], default: "BDT" },

    cus_name: { type: String },
    cus_email: { type: String },
    cus_phone: { type: String },
    cus_add1: { type: String },
    cus_city: { type: String },
    cus_country: { type: String },
    shipping_method: { type: String, enum: ["NO", "Courier"], default: "NO" },
    product_name: { type: String },
    product_category: { type: String },
    product_profile: {
      type: String,
      enum: ["general", "digital", "giftcard"],
      default: "general",
    },
    payment: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    val_id: { type: String },
    card_type: { type: String },
    bank_tran_id: { type: String },
    payment_status: { type: String },
    tran_date: { type: String },
    card_issuer: { type: String },
    card_issuer_country: { type: String },
    verify_sign: { type: String },
    verify_key: { type: String },
    currency_amount: { type: String },
    risk_title: { type: String },
    status: { type: String, enum: ["pending", "success"] },
    deliveryStatus: {
      type: String,
      enum: [
        "pending",
        "confrim",
        "cancel",
        "on-curiar",
        "return",
        "delivered",
      ],
      default: "pending",
    },
    card_brand: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model<TTransaction>(
  "Transaction",
  TransactionSchema,
);
