import mongoose from "mongoose";
import { TProduct } from "./product_interface";
import { ImageSchema, VideoSchema } from "../../schema/file_Schema";

const ProductSchema = new mongoose.Schema<TProduct>(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: {
      type: [ImageSchema],
      default: [],
      required: true,
    },
    video: {
      type: [VideoSchema],
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
  },
  { timestamps: true },
);

export const Product = mongoose.model<TProduct>("Product", ProductSchema);
