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
exports.handleMultipleFileUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const file_libs_1 = require("./file_libs");
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Allowed file formats
const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
];
const allowedVideoTypes = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
    "video/mpeg",
    "video/webm",
    "video/ogg",
];
const unlinkAsync = util_1.default.promisify(fs_1.default.unlink);
// Suppose we only allow images up to 5MB:
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const handleMultipleFileUpload = (req, res, next) => {
    // First, let Multer handle the basic uploading with a 50MB per-file limit:
    file_libs_1.filesUpload.fields([{ name: "images" }, { name: "videos", maxCount: 1 }])(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err instanceof multer_1.default.MulterError) {
            // e.g. LIMIT_FILE_SIZE if > 50MB
            return next(new AppError_1.default(400, err.message));
        }
        else if (err) {
            // Other errors
            return next(new AppError_1.default(500, err.message));
        }
        // If Multer didn't throw, let's do manual checks:
        const files = req.files;
        if (!files) {
            // No files uploaded, just proceed:
            throw new AppError_1.default(400, "Please upload at least one file");
        }
        try {
            // 1) Validate MIME types
            if (files.images &&
                files.images.some((file) => !allowedImageTypes.includes(file.mimetype))) {
                throw new AppError_1.default(400, "Invalid images file type");
            }
            if (files.videos &&
                files.videos.some((file) => !allowedVideoTypes.includes(file.mimetype))) {
                throw new AppError_1.default(400, "Invalid videos file type");
            }
            // 2) Check image-file sizes manually (<= 5MB each)
            const allImages = [...(files.images || [])];
            for (const image of allImages) {
                if (image.size > MAX_IMAGE_SIZE) {
                    // If the image is too big, remove it immediately and throw error
                    yield unlinkAsync(image.path).catch((unlinkErr) => {
                        console.error("Failed to remove oversized image:", image.path, unlinkErr);
                    });
                    throw new AppError_1.default(400, `One of the images exceeds the 5MB limit`);
                }
            }
            // If everything is valid, proceed:
            return next();
        }
        catch (validationError) {
            // On validation error, remove all uploaded files to avoid partials:
            yield Promise.all(["images", "videos"].flatMap((field) => files[field]
                ? files[field].map((file) => unlinkAsync(file.path).catch((unlinkErr) => {
                    console.error("Failed to remove file:", file.path, unlinkErr);
                }))
                : []));
            return next(validationError);
        }
    }));
};
exports.handleMultipleFileUpload = handleMultipleFileUpload;
