"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_constants_1 = require("./order_constants");
const OrderProductSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product id is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
    },
}, { _id: false });
const OrderSchema = new mongoose_1.default.Schema({
    orderID: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        trim: true,
        ref: "Transaction",
    },
    isFullPay: {
        type: Boolean,
        default: false,
    },
    payment: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Unpaid",
    },
    status: {
        type: String,
        enum: order_constants_1.status,
        default: "pending",
    },
    deliveryStatus: {
        type: String,
        enum: order_constants_1.deliveryStatus,
        default: "pending",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Order = mongoose_1.default.model("Order", OrderSchema);
