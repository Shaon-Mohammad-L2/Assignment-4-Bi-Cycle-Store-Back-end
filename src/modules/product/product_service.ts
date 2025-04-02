import { TProduct } from "./product_interface";

// create product into db.
const createProductIntoDB = async (files: any, payload: TProduct) => {
  console.log(payload);
  console.log(files);
};

export const ProductServices = {
  createProductIntoDB,
};
