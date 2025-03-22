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
const config_1 = __importDefault(require("../config"));
const zod_1 = require("zod");
const handleZodValidationError_1 = __importDefault(require("../errors/handleZodValidationError"));
const handleMongooseValidationErro_1 = __importDefault(require("../errors/handleMongooseValidationErro"));
const handleMongooseCastError_1 = __importDefault(require("../errors/handleMongooseCastError"));
const handleMongooseDuplicateError_1 = __importDefault(require("../errors/handleMongooseDuplicateError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize default error details
    let statusCode = 500;
    let message = "Something went wrong";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    // Zod validation error handling
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Mongoose validation error handling
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleMongooseValidationErro_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Mongoose cast error handling
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleMongooseCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Mongoose Duplicate erorr handling.
    else if (err.code === 11000) {
        const simplifiedError = (0, handleMongooseDuplicateError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Custom AppError handling
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errorSources = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    // Built-in error handling
    else if (err instanceof Error) {
        message = err === null || err === void 0 ? void 0 : err.message;
        errorSources = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message,
        error: errorSources,
        stack: config_1.default.NODE_ENV === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
});
exports.default = globalErrorHandler;
