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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("./user_constant");
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
    },
    provider: {
        type: String,
        default: "email",
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "email"; // Password is required only for "email" provider
        },
        select: 0,
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: user_constant_1.UserRole,
        default: "user",
    },
    status: {
        type: String,
        enum: user_constant_1.UserStatus,
        default: "in-progress",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
//statics methods for user already Exists by _id / mongodb default _id
UserSchema.statics.isUserAlreadyExistsBy_id = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.User.findById(_id).select("+password");
        return result;
    });
};
//statics methods for user already Exists by email
UserSchema.statics.isUserAlreadyExistsBy_email = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.User.findOne({ email }).select("+password");
        return result;
    });
};
// statics methods for user blocked or deleted .
UserSchema.statics.isUserBlockedOrDeletedFindBy_id = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.User.findById(_id);
        if (!user) {
            throw new AppError_1.default(404, "This user is not found!");
        }
        if (user.status === "blocked") {
            throw new AppError_1.default(403, "This user is already blocked!");
        }
        if (user.isDeleted) {
            throw new AppError_1.default(401, "This user is already deleted!");
        }
        return user;
    });
};
//statics methods for user password matched.
UserSchema.statics.isPasswordMached = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
//statics methods for user change password time.
UserSchema.statics.isJWTIssuedAtBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    const passwordChangedTimeInt = parseInt(passwordChangedTime.toString());
    const result = passwordChangedTimeInt > jwtIssuedTimestamp;
    return result;
};
// pre save hook / middleware for password bcrypt.
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
//post save hook / middleware for password null.
UserSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
//create User Model.
exports.User = mongoose_1.default.model("User", UserSchema);
