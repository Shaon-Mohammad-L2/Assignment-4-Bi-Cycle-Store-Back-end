"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    NODE_ENV: process.env.NODE_ENV || "production",
    port: process.env.PORT || 5000,
    bcrypt_salt_rounds: process.env.bcrypt,
    mongo_database_url: process.env.MONGO_DATABASE_URL,
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    email_host_provider_name: process.env.EMAIL_HOST_PROVIDER_NAME,
    email_host_provider_port: process.env.EMAIL_HOST_PROVIDER_PORT,
    email_sender_email: process.env.EMAIL_SENDER_EMAIL,
    email_sender_email_app_pass: process.env.EMAIL_SENDER_EMAIL_APP_PASS,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    sslCommerz_store_id: process.env.SSLCOMMERZ_STORE_ID,
    sslCommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD,
    sslCommerz_payment_success_url: process.env.SSLCOMMERZ_SUCCESS_URL,
    sslCommerz_payment_cancel_url: process.env.SSLCOMMERZ_CANCEL_URL,
    sslCommerz_payment_fail_url: process.env.SSLCOMMERZ_FAIL_URL,
    payment_success_client_url: process.env.PAYMENT_SUCCESS_CLIENT_URL,
    payment_fail_client_url: process.env.PAYMENT_FAIL_CLIENT_URL,
    payment_cancel_client_url: process.env.PAYMENT_CANCEL_CLIENT_URL,
};
