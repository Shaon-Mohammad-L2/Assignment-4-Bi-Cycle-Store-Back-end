"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const product_validationZodSchema_1 = require("./product_validationZodSchema");
const product_controller_1 = require("./product_controller");
const formDataToSetJSONformatData_1 = __importDefault(require("../../middleware/formDataToSetJSONformatData"));
const file_utils_1 = require("../../utils/multiple_file_upload/file_utils");
const router = express_1.default.Router();
// create product.
router.post("/create", (0, auth_1.default)("admin"), file_utils_1.handleMultipleFileUpload, formDataToSetJSONformatData_1.default, (0, validateRequest_1.default)(product_validationZodSchema_1.ProductValidation.createProductValidationZodSchema), product_controller_1.ProdcutControllers.createProduct);
// product update.
router.put("/:id/update", (0, auth_1.default)("admin"), file_utils_1.handleMultipleFileUpload, formDataToSetJSONformatData_1.default, (0, validateRequest_1.default)(product_validationZodSchema_1.ProductValidation.updateProductValidationZodSchema), product_controller_1.ProdcutControllers.updateProduct);
// fetch all products for admin.
router.get("/me", (0, auth_1.default)("admin", "developer", "superAdmin"), product_controller_1.ProdcutControllers.getAllProductsForAdmin);
// fetch all products
router.get("/", product_controller_1.ProdcutControllers.getAllProducts);
exports.ProductRoutes = router;
