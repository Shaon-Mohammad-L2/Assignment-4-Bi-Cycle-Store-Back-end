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
exports.upload = exports.sendImageToCloudinary = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const config_1 = __importDefault(require("../config"));
const auth_utils_1 = require("../modules/auth/auth_utils");
// Configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const sendImageToCloudinary = (fileName_1, path_1, ...args_1) => __awaiter(void 0, [fileName_1, path_1, ...args_1], void 0, function* (fileName, path, resource_type = "image") {
    const uniqueNumber = (0, auth_utils_1.generateOTP)();
    // Upload an image
    try {
        const uploadResult = yield cloudinary_1.v2.uploader.upload(path, {
            public_id: `${fileName}${uniqueNumber}`,
            resource_type,
        });
        // Optimize delivery by resizing and applying auto-format and auto-quality
        let optimizeUrl = "";
        if (resource_type === "image") {
            optimizeUrl = cloudinary_1.v2.url(fileName, {
                fetch_format: "auto",
                quality: "auto",
            });
        }
        //remove the local file after upload.
        fs_1.default.unlink(path, (err) => {
            if (err) {
                throw new Error("File removing Faield!");
            }
        });
        return Object.assign(Object.assign({}, uploadResult), { optimizeUrl });
    }
    catch (err) {
        throw new AppError_1.default(err === null || err === void 0 ? void 0 : err.http_code, err === null || err === void 0 ? void 0 : err.message);
    }
});
exports.sendImageToCloudinary = sendImageToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "image") {
            cb(null, process.cwd() + "/uploads/images");
        }
        else if (file.fieldname === "video") {
            cb(null, process.cwd() + "/uploads/videos");
        }
        else {
            cb(new Error("Invalid Filed name"), "false");
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
