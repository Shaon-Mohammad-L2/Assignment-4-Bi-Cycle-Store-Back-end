"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// If your max allowed video size is 50MB:
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
// Ensure directory exists before saving
function ensureDirectoryExists(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        if (file.fieldname === "videos") {
            uploadPath = path_1.default.join(process.cwd(), "uploads/videos");
        }
        else if (file.fieldname === "images") {
            uploadPath = path_1.default.join(process.cwd(), "uploads/images");
        }
        else {
            return cb(new AppError_1.default(400, "Invalid field name"), "");
        }
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
// This Multer config sets the *global* file-size limit to 50MB
exports.filesUpload = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
});
