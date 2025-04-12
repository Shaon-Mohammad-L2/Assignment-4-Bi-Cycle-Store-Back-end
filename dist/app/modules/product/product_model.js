"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const file_Schema_1 = require("../../schema/file_Schema");
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    brand: {
        type: String,
        trim: true,
    },
    images: {
        type: [file_Schema_1.ImageSchema],
        default: [],
        required: true,
    },
    video: {
        type: [file_Schema_1.VideoSchema],
        default: [],
    },
    model: {
        type: String,
        trim: true,
    },
    costing: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: String,
        required: true,
        trim: true,
    },
    currency: {
        type: String,
        default: "BDT",
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    code: {
        type: String,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Product = mongoose_1.default.model("Product", ProductSchema);
