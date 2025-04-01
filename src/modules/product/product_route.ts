import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ProductValidation } from "./product_validationZodSchema";
import { ProdcutControllers } from "./product_controller";
const router = express.Router();

// create product.
router.post(
  "/create",
  auth("user"),
  validateRequest(ProductValidation.createProductValidationZodSchema),
  ProdcutControllers.createProduct
);

export const ProductRoutes = router;
