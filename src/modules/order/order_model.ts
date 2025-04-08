import mongoose from "mongoose";
import { TOrder, TOrderProducts } from "./order_interface";
import { deliveryStatus, status } from "./order_constants";

const OrderProductSchema = new mongoose.Schema<TOrderProducts>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema<TOrder>(
  {
    orderID: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "User id is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
    },
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required!"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total Amount is required!"],
      default: 0,
    },
    totalQuantity: {
      type: Number,
      required: [true, "Total Quantity is required!"],
      default: 0,
    },
    paid: {
      type: Number,
      required: [true, "Paid Amount is required!"],
      default: 0,
    },
    due: {
      type: Number,
      required: [true, "Due Amount is required!"],
      default: 0,
    },
    currency: {
      type: String,
      enum: ["BDT"],
      default: "BDT",
    },
    products: {
      type: [OrderProductSchema],
      required: [true, "Product is required"],
    },
    transactionId: {
      type: String,
      trim: true,
      unique: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Transaction",
    },
    isFullPay: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: status,
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: deliveryStatus,
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<TOrder>("Order", OrderSchema);
