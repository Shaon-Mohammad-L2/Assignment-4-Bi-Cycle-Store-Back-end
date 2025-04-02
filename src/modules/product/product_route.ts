import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ProductValidation } from "./product_validationZodSchema";
import { ProdcutControllers } from "./product_controller";
import formDataToSetJSONformatData from "../../middleware/formDataToSetJSONformatData";
import { handleMultipleFileUpload } from "../../utils/multiple_file_upload/file_utils";
const router = express.Router();

// create product.
router.post(
  "/create",
  auth("admin"),
  handleMultipleFileUpload,
  formDataToSetJSONformatData,
  validateRequest(ProductValidation.createProductValidationZodSchema),
  ProdcutControllers.createProduct
);

// product update.
router.put(
  "/:id/update",
  auth("admin"),
  handleMultipleFileUpload,
  formDataToSetJSONformatData,
  validateRequest(ProductValidation.updateProductValidationZodSchema),
  ProdcutControllers.updateProduct
);

// fetch all products for admin.
router.get(
  "/me",
  auth("admin", "developer", "superAdmin"),
  ProdcutControllers.getAllProductsForAdmin
);
export const ProductRoutes = router;
