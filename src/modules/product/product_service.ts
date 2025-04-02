import AppError from "../../errors/AppError";
import { TImageAsset, TVideoAsset } from "../../interface/imageAsset";
import { deleteImageFromCloudinary } from "../../utils/deleteImageFromCloudinary";
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
  if (!files || !files.images || files.images.length === 0) {
    throw new AppError(400, "At least one image file is required.");
  }
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

// update product into db.
export const updateProductIntoDB = async (
  user: JwtPayload,
  productId: string,
  files: any,
  payload: Partial<TProduct> & {
    imageDelete?: string[];
    videoDelete?: string[];
  }
) => {
  // check user info and status.
  await Client.isUserAndClientInformationFindBy_id(user.user_id);

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    throw new AppError(404, "Product is not found");
  }
  if (existingProduct.isDeleted) {
    throw new AppError(400, "Product is already deleted");
  }

  // check duplicate code.
  if (
    payload.code &&
    payload.code.toLowerCase() !== existingProduct.code?.toLowerCase()
  ) {
    const existingCode = await Product.findOne({
      code: payload.code.toLowerCase(),
    })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();
    if (existingCode) {
      throw new AppError(400, "Product code already exists!");
    }
  }

  // check image delete request.
  if (payload.imageDelete && payload.imageDelete.length > 0) {
    const productImagePublicIds = existingProduct.images.map(
      (img) => img.public_id
    );

    for (const public_id of payload.imageDelete) {
      if (!productImagePublicIds.includes(public_id)) {
        throw new AppError(400, `Invalid one or more image public_id.`);
      }
    }
    const newImageCount =
      existingProduct.images.length - payload.imageDelete.length;

    if (newImageCount < 1) {
      throw new AppError(
        400,
        "Cannot delete all images. At least one image must remain."
      );
    }

    for (const public_id of payload.imageDelete) {
      await deleteImageFromCloudinary(public_id, "image");

      existingProduct.images = existingProduct.images.filter(
        (img) => img.public_id !== public_id
      );
    }
  }

  // check video delete request.
  if (payload.videoDelete && payload.videoDelete.length > 0) {
    const productVideoPublicIds = existingProduct?.video?.map(
      (vid) => vid.public_id
    );

    for (const public_id of payload.videoDelete) {
      if (!productVideoPublicIds?.includes(public_id)) {
        throw new AppError(400, `Invalid one or more video public_id.`);
      }
    }
    for (const public_id of payload.videoDelete) {
      await deleteImageFromCloudinary(public_id, "video");

      existingProduct.video = existingProduct?.video?.filter(
        (vdo) => vdo.public_id !== public_id
      );
    }
  }

  // add new image file.
  if (files?.images && Array.isArray(files.images) && files.images.length > 0) {
    for (const fileObj of files.images) {
      const { public_id, optimizeUrl, secure_url } =
        await sendImageToCloudinary(
          payload.name ?? existingProduct.name,
          fileObj.path,
          "image"
        );

      const imageData: TImageAsset = {
        public_id,
        optimizeUrl,
        secure_url,
      } as TImageAsset;
      existingProduct.images.push(imageData);
    }
  }

  // add new video file.
  if (files?.videos && Array.isArray(files.videos) && files.videos.length > 0) {
    if (!Array.isArray(existingProduct.video)) {
      existingProduct.video = [];
    }
    for (const fileObj of files.videos) {
      const { public_id, secure_url } = await sendImageToCloudinary(
        payload.name ?? existingProduct.name,
        fileObj.path,
        "video"
      );

      const videoData: TVideoAsset = {
        public_id,
        secure_url,
      } as TVideoAsset;
      existingProduct.video.push(videoData);
    }
  }

  // new updated data.
  const updateData: Partial<TProduct> = {
    name: payload.name ?? existingProduct.name,
    description: payload.description ?? existingProduct.description,
    category: payload.category ?? existingProduct.category,
    brand: payload.brand ?? existingProduct.brand,
    model: payload.model ?? existingProduct.model,
    costing: payload.costing ?? existingProduct.costing,
    price: payload.price ?? existingProduct.price,
    stock: payload.stock ?? existingProduct.stock,
    images: existingProduct.images,
    video: existingProduct.video,
    code: payload.code ?? existingProduct.code,
    discountPrice: payload.discountPrice ?? existingProduct.discountPrice,
    currency: payload.currency ?? existingProduct.currency,
    ratings: payload.ratings ?? existingProduct.ratings,
    tags: payload.tags ?? existingProduct.tags,
    sold: payload.sold ?? existingProduct.sold,
    isActive: payload.isActive ?? existingProduct.isActive,
    isDeleted: payload.isDeleted ?? existingProduct.isDeleted,
  };

  // update product data.
  existingProduct.set(updateData);
  const updatedProduct = await existingProduct.save();

  return updatedProduct;
};
export const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
};
