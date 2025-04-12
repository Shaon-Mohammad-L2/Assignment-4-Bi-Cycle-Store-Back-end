import mongoose from "mongoose";
import { TTransaction } from "./transaction_interface";

const TransactionSchema = new mongoose.Schema<TTransaction>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    tran_id: { type: String, required: true, unique: true },

    total_amount: { type: Number, required: true },
    total_quantity: { type: Number, required: true },
    currency: { type: String, enum: ["BDT"], default: "BDT" },

    cus_name: String,
    cus_email: String,
    cus_phone: String,
    cus_add1: String,
    cus_city: String,
    cus_country: String,

    shipping_method: { type: String, default: "NO" },
    product_name: String,
    product_category: String,
    product_profile: {
      type: String,
      enum: ["general", "digital", "giftcard"],
      default: "general",
    },

    payment: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    val_id: String,
    card_type: String,
    bank_tran_id: String,
    payment_status: String,
    tran_date: String,
    card_issuer: String,
    card_issuer_country: String,
    card_issuer_country_code: String,
    card_brand: String,
    card_no: String,

    verify_sign: String,
    verify_sign_sha2: String,
    verify_key: String,

    currency_amount: String,
    currency_rate: String,
    currency_type: String,
    store_amount: String,
    amount: String,
    base_fair: String,

    risk_title: String,
    risk_level: String,

    status: { type: String, enum: ["pending", "success"], default: "pending" },
    deliveryStatus: {
      type: String,
      enum: [
        "pending",
        "confirm",
        "cancel",
        "on-curiar",
        "return",
        "delivered",
      ],
      default: "pending",
    },

    error: String,
    store_id: String,
    value_a: String,
    value_b: String,
    value_c: String,
    value_d: String,
    subscription_id: String,
    card_ref_id: String,

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<TTransaction>(
  "Transaction",
  TransactionSchema
);
