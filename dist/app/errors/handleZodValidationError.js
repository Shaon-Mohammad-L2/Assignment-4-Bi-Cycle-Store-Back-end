"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodValidationError = (error) => {
    const errorSources = error.issues.map((issues) => {
        return {
            path: issues === null || issues === void 0 ? void 0 : issues.path[issues.path.length - 1],
            message: issues.message,
        };
    });
    const statusCode = 400;
    const message = "Validation Error";
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = handleZodValidationError;
