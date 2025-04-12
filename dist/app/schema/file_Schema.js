"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSchema = exports.ImageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ImageSchema = new mongoose_1.default.Schema({
    public_id: {
        type: String,
        required: true,
    },
    secure_url: {
        type: String,
        required: true,
    },
    optimizeUrl: {
        type: String,
        required: true,
    },
}, {
    _id: false,
});
exports.VideoSchema = new mongoose_1.default.Schema({
    public_id: {
        type: String,
        required: true,
    },
    secure_url: {
        type: String,
        required: true,
    },
}, {
    _id: false,
});
