import { Types } from "mongoose";
import { TImageAsset } from "../../interface/imageAsset";

export type TProduct = {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  category?: Types.ObjectId | null;
  brand?: string;
  images: TImageAsset[];
  costing: string;
  price: string;
  currency?: "BDT";
  model?: string;
  stock: number;
  sold: number;
  code?: string;
  discountPrice?: string;
  ratings?: number;
  tags?: string[];
  isActive: boolean;
  isDeleted: boolean;
};
