import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product_service";

// create product.
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductIntoDB(
    req.user,
    req.files,
    req.body
  );

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// update product.
const updateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProductIntoDB(
    req.user,
    req.params.id,
    req.files,
    req.body
  );

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

export const ProdcutControllers = {
  createProduct,
  updateProduct,
};
