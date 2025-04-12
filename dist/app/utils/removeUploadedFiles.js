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
exports.removeSingleUploadedFile = exports.removeUploadedFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const unlinkAsync = util_1.default.promisify(fs_1.default.unlink);
const removeUploadedFiles = (files) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(["images", "videos"].flatMap((field) => files[field]
        ? files[field].map((file) => unlinkAsync(file.path).catch((err) => {
            console.error("Failed to remove file:", file.path, err);
        }))
        : []));
});
exports.removeUploadedFiles = removeUploadedFiles;
//remove the local file after upload.
const removeSingleUploadedFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.unlink(path, (err) => {
        if (err) {
            throw new Error("File removing Faield!");
        }
    });
});
exports.removeSingleUploadedFile = removeSingleUploadedFile;
