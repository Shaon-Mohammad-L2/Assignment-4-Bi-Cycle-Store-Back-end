import { TProduct } from "./product_interface";

// create product into db.
const createProductIntoDB = async (payload: TProduct) => {
  console.log(payload);
};

export const ProductServices = {
  createProductIntoDB,
};
