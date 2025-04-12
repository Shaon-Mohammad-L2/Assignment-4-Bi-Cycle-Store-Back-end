"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMongooseDuplicateError = (err) => {
    var _a, _b;
    const match = err.message.match(/dup key: \{\s*([^:]+):\s*"([^"]+)"\s*\}/);
    const fieldName = ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || "unknown_field";
    const fieldValue = ((_b = match === null || match === void 0 ? void 0 : match[2]) === null || _b === void 0 ? void 0 : _b.trim()) || "unknown_value";
    const errorSources = [
        {
            path: fieldName || "",
            message: fieldValue
                ? `${fieldValue} is Already exists!`
                : "Duplicate Error",
        },
    ];
    const statusCode = 409;
    const message = "Duplicate Error";
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = handleMongooseDuplicateError;
