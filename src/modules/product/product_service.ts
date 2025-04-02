import AppError from "../../errors/AppError";
import { TImageAsset, TVideoAsset } from "../../interface/imageAsset";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { Client } from "../client/client_model";
import { TProduct } from "./product_interface";
import { Product } from "./product_model";
import { JwtPayload } from "jsonwebtoken";

// create product into db.
const createProductIntoDB = async (
  user: JwtPayload,
  files: any,
  payload: TProduct
) => {
  await Client.isUserAndClientInformationFindBy_id(user.user_id);

  const existingCode = await Product.findOne({
    code: payload?.code?.toLowerCase(),
  })
    .collation({ locale: "en", strength: 2 })
    .select("_id")
    .lean();

  if (existingCode) {
    throw new AppError(400, "Product code already exists!");
  }

  if (!files || (!files.images && !files.videos)) {
    throw new AppError(400, "No files found to upload!");
  }

  const uploadedImageFiles: TImageAsset[] = [];
  const uploadedVideoFile: TVideoAsset[] = [];

  if (files.images && Array.isArray(files.images) && files.images.length > 0) {
    for (const fileObj of files.images) {
      // Upload each image to Cloudinary
      const { public_id, optimizeUrl, secure_url } =
        await sendImageToCloudinary(payload.name, fileObj.path, "image");

      const imageData: TImageAsset = {
        public_id,
        optimizeUrl,
        secure_url,
      } as TImageAsset;

      uploadedImageFiles.push(imageData);
    }
  }

  if (files.videos && Array.isArray(files.videos) && files.videos.length > 0) {
    for (const fileObj of files.videos) {
      const { public_id, secure_url } = await sendImageToCloudinary(
        payload.name,
        fileObj.path,
        "video"
      );

      const videoData: TVideoAsset = {
        public_id,
        secure_url,
      } as TVideoAsset;

      uploadedVideoFile.push(videoData);
    }
  }

  payload.images = uploadedImageFiles;
  payload.video = uploadedVideoFile;

  const result = await Product.create(payload);
  return result;
};

export const ProductServices = {
  createProductIntoDB,
};
