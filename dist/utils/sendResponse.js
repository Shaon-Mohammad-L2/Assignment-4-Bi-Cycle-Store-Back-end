"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    return res.status(data.status).json({
        status: data.status,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
