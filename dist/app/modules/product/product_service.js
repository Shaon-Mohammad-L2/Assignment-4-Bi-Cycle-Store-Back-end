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
exports.ProductServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const deleteImageFromCloudinary_1 = require("../../utils/deleteImageFromCloudinary");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const client_model_1 = require("../client/client_model");
const product_constant_1 = require("./product_constant");
const product_model_1 = require("./product_model");
// create product into db.
const createProductIntoDB = (user, files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!files || !files.images || files.images.length === 0) {
        throw new AppError_1.default(400, "At least one image file is required.");
    }
    yield client_model_1.Client.isUserAndClientInformationFindBy_id(user.user_id);
    const existingCode = yield product_model_1.Product.findOne({
        code: (_a = payload === null || payload === void 0 ? void 0 : payload.code) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
    })
        .collation({ locale: "en", strength: 2 })
        .select("_id")
        .lean();
    if (existingCode) {
        throw new AppError_1.default(400, "Product code already exists!");
    }
    if (!files || (!files.images && !files.videos)) {
        throw new AppError_1.default(400, "No files found to upload!");
    }
    const uploadedImageFiles = [];
    const uploadedVideoFile = [];
    if (files.images && Array.isArray(files.images) && files.images.length > 0) {
        for (const fileObj of files.images) {
            // Upload each image to Cloudinary
            const { public_id, optimizeUrl, secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(payload.name, fileObj.path, "image");
            const imageData = {
                public_id,
                optimizeUrl,
                secure_url,
            };
            uploadedImageFiles.push(imageData);
        }
    }
    if (files.videos && Array.isArray(files.videos) && files.videos.length > 0) {
        for (const fileObj of files.videos) {
            const { public_id, secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(payload.name, fileObj.path, "video");
            const videoData = {
                public_id,
                secure_url,
            };
            uploadedVideoFile.push(videoData);
        }
    }
    payload.images = uploadedImageFiles;
    payload.video = uploadedVideoFile;
    const result = yield product_model_1.Product.create(payload);
    return result;
});
// update product into db.
const updateProductIntoDB = (user, productId, files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    // check user info and status.
    yield client_model_1.Client.isUserAndClientInformationFindBy_id(user.user_id);
    const existingProduct = yield product_model_1.Product.findById(productId);
    if (!existingProduct) {
        throw new AppError_1.default(404, "Product is not found");
    }
    if (existingProduct.isDeleted) {
        throw new AppError_1.default(400, "Product is already deleted");
    }
    // check duplicate code.
    if (payload.code &&
        payload.code.toLowerCase() !== ((_a = existingProduct.code) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
        const existingCode = yield product_model_1.Product.findOne({
            code: payload.code.toLowerCase(),
        })
            .collation({ locale: "en", strength: 2 })
            .select("_id")
            .lean();
        if (existingCode) {
            throw new AppError_1.default(400, "Product code already exists!");
        }
    }
    // check image delete request.
    if (payload.imageDelete && payload.imageDelete.length > 0) {
        const productImagePublicIds = existingProduct.images.map((img) => img.public_id);
        for (const public_id of payload.imageDelete) {
            if (!productImagePublicIds.includes(public_id)) {
                throw new AppError_1.default(400, `Invalid one or more image public_id.`);
            }
        }
        const newImageCount = existingProduct.images.length - payload.imageDelete.length;
        if (newImageCount < 1) {
            throw new AppError_1.default(400, "Cannot delete all images. At least one image must remain.");
        }
        for (const public_id of payload.imageDelete) {
            yield (0, deleteImageFromCloudinary_1.deleteImageFromCloudinary)(public_id, "image");
            existingProduct.images = existingProduct.images.filter((img) => img.public_id !== public_id);
        }
    }
    // check video delete request.
    if (payload.videoDelete && payload.videoDelete.length > 0) {
        const productVideoPublicIds = (_b = existingProduct === null || existingProduct === void 0 ? void 0 : existingProduct.video) === null || _b === void 0 ? void 0 : _b.map((vid) => vid.public_id);
        for (const public_id of payload.videoDelete) {
            if (!(productVideoPublicIds === null || productVideoPublicIds === void 0 ? void 0 : productVideoPublicIds.includes(public_id))) {
                throw new AppError_1.default(400, `Invalid one or more video public_id.`);
            }
        }
        for (const public_id of payload.videoDelete) {
            yield (0, deleteImageFromCloudinary_1.deleteImageFromCloudinary)(public_id, "video");
            existingProduct.video = (_c = existingProduct === null || existingProduct === void 0 ? void 0 : existingProduct.video) === null || _c === void 0 ? void 0 : _c.filter((vdo) => vdo.public_id !== public_id);
        }
    }
    // add new image file.
    if ((files === null || files === void 0 ? void 0 : files.images) && Array.isArray(files.images) && files.images.length > 0) {
        for (const fileObj of files.images) {
            const { public_id, optimizeUrl, secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)((_d = payload.name) !== null && _d !== void 0 ? _d : existingProduct.name, fileObj.path, "image");
            const imageData = {
                public_id,
                optimizeUrl,
                secure_url,
            };
            existingProduct.images.push(imageData);
        }
    }
    // add new video file.
    if ((files === null || files === void 0 ? void 0 : files.videos) && Array.isArray(files.videos) && files.videos.length > 0) {
        if (!Array.isArray(existingProduct.video)) {
            existingProduct.video = [];
        }
        for (const fileObj of files.videos) {
            const { public_id, secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)((_e = payload.name) !== null && _e !== void 0 ? _e : existingProduct.name, fileObj.path, "video");
            const videoData = {
                public_id,
                secure_url,
            };
            existingProduct.video.push(videoData);
        }
    }
    // new updated data.
    const updateData = {
        name: (_f = payload.name) !== null && _f !== void 0 ? _f : existingProduct.name,
        description: (_g = payload.description) !== null && _g !== void 0 ? _g : existingProduct.description,
        category: (_h = payload.category) !== null && _h !== void 0 ? _h : existingProduct.category,
        brand: (_j = payload.brand) !== null && _j !== void 0 ? _j : existingProduct.brand,
        model: (_k = payload.model) !== null && _k !== void 0 ? _k : existingProduct.model,
        costing: (_l = payload.costing) !== null && _l !== void 0 ? _l : existingProduct.costing,
        price: (_m = payload.price) !== null && _m !== void 0 ? _m : existingProduct.price,
        stock: (_o = payload.stock) !== null && _o !== void 0 ? _o : existingProduct.stock,
        images: existingProduct.images,
        video: existingProduct.video,
        code: (_p = payload.code) !== null && _p !== void 0 ? _p : existingProduct.code,
        discountPrice: (_q = payload.discountPrice) !== null && _q !== void 0 ? _q : existingProduct.discountPrice,
        currency: (_r = payload.currency) !== null && _r !== void 0 ? _r : existingProduct.currency,
        ratings: (_s = payload.ratings) !== null && _s !== void 0 ? _s : existingProduct.ratings,
        tags: (_t = payload.tags) !== null && _t !== void 0 ? _t : existingProduct.tags,
        sold: (_u = payload.sold) !== null && _u !== void 0 ? _u : existingProduct.sold,
        isActive: (_v = payload.isActive) !== null && _v !== void 0 ? _v : existingProduct.isActive,
        isDeleted: (_w = payload.isDeleted) !== null && _w !== void 0 ? _w : existingProduct.isDeleted,
    };
    // update product data.
    existingProduct.set(updateData);
    const updatedProduct = yield existingProduct.save();
    return updatedProduct;
});
// fetch all product from db for admin..
const fetchAllProductsForAdminFromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_model_1.Client.isUserAndClientInformationFindBy_id(user.user_id);
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find(), query)
        .search(product_constant_1.productSearchableFields)
        .sort()
        .fields()
        .filter();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { result, meta };
});
// fetch all product from db for admin..
const fetchAllProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find({ isActive: { $ne: false } }).select("-costing -isActive -isDeleted -updatedAt"), query)
        .search(product_constant_1.productSearchableFields)
        .sort()
        .fields()
        .filter();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { result, meta };
});
exports.ProductServices = {
    createProductIntoDB,
    updateProductIntoDB,
    fetchAllProductsForAdminFromDB,
    fetchAllProductsFromDB,
};
