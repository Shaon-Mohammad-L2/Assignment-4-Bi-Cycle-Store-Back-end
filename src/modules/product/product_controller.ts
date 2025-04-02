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

// Fetch all product for Admin
const getAllProductsForAdmin = catchAsync(async (req, res) => {
  const result = await ProductServices.fetchAllProductsForAdminFromDB(
    req.user,
    req.query
  );

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Products retrived successfully",
    data: result.result,
    meta: result.meta,
  });
});

// Fetch all product
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.fetchAllProductsFromDB(req.query);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Products retrived successfully",
    data: result.result,
    meta: result.meta,
  });
});

export const ProdcutControllers = {
  createProduct,
  updateProduct,
  getAllProductsForAdmin,
  getAllProducts,
};
