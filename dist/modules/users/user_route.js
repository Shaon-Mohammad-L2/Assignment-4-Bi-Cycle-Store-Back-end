"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_zodValidationSchema_1 = require("./user_zodValidationSchema");
const user_controller_1 = require("./user_controller");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(user_zodValidationSchema_1.UserValidation.createUserValidationZodSchema), user_controller_1.UserControllers.createUser);
exports.UserRoutes = router;
