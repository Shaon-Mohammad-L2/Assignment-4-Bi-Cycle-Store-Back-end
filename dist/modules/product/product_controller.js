"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdcutControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product_service");
// create product.
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.createProductIntoDB(req.user, req.files, req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Product created successfully",
        data: result,
    });
}));
// update product.
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.updateProductIntoDB(req.user, req.params.id, req.files, req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
}));
// Fetch all product for Admin
const getAllProductsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.fetchAllProductsForAdminFromDB(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Products retrived successfully",
        data: result.result,
        meta: result.meta,
    });
}));
// Fetch all product
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.fetchAllProductsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Products retrived successfully",
        data: result.result,
        meta: result.meta,
    });
}));
exports.ProdcutControllers = {
    createProduct,
    updateProduct,
    getAllProductsForAdmin,
    getAllProducts,
};
