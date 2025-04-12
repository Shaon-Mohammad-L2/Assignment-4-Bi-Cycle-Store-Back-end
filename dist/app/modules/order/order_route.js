"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const order_validationZodSchema_1 = require("./order_validationZodSchema");
const order_controller_1 = require("./order_controller");
const router = express_1.default.Router();
// create order
router.post("/create", (0, auth_1.default)("user"), (0, validateRequest_1.default)(order_validationZodSchema_1.OrderValidation.createOrderValidationZodSchema), order_controller_1.OrderController.createOrder);
// delivery status update.
router.put("/:id/update-status", (0, auth_1.default)("admin", "developer", "superAdmin"), (0, validateRequest_1.default)(order_validationZodSchema_1.OrderValidation.updateOrderStatusZodSchema), order_controller_1.OrderController.updateOrderStatus);
exports.OrderRoutes = router;
