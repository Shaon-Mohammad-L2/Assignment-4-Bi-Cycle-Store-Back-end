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
exports.Client = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../users/user_model");
const ClientSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "User ID is required!"],
        index: false,
        ref: "User",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    picture: {
        type: String,
    },
}, {
    timestamps: true,
});
// statics method for search client in db.
ClientSchema.statics.isExistClientInDBFindBy_user = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.Client.findOne({ user });
    });
};
// user and client information.
ClientSchema.statics.isUserAndClientInformationFindBy_id = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.User.isUserBlockedOrDeletedFindBy_id(_id);
        const client = yield exports.Client.findById(_id);
        return { user, client };
    });
};
exports.Client = mongoose_1.default.model("Client", ClientSchema);
