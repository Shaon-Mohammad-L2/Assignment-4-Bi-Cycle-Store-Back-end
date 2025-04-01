import mongoose from "mongoose";
import { TImageAsset } from "../interface/imageAsset";

export const ImageSchema = new mongoose.Schema<TImageAsset>(
  {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    optimizeUrl: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
