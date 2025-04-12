"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PasswordResetSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
    },
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordOTPExpires: {
        type: Date,
    },
    otpRequestCount: {
        type: Number,
        default: 0,
    },
    otpRequestLockUntil: {
        type: Date,
    },
    invalidOtpAttempts: {
        type: Number,
        default: 0,
    },
    otpLockUntil: {
        type: Date,
    },
    isOTPVerified: {
        type: Boolean,
        default: false,
    },
});
exports.PasswordReset = mongoose_1.default.model("PasswordReset", PasswordResetSchema);
