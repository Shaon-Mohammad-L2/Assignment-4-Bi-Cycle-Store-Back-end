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
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_utils_1 = require("../modules/auth/auth_utils");
const user_model_1 = require("../modules/users/user_model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// initiate authentication route auth function
const auth = (...requiredRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        // if the token is sent from the client.
        if (!token) {
            throw new AppError_1.default(401, "You are not authorized");
        }
        // check if the token is valid.
        const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_access_token_secret);
        const { user_id, role, iat } = decoded;
        //checking if the user is exist in the database
        const user = yield user_model_1.User.isUserAlreadyExistsBy_id(user_id);
        if (!user) {
            throw new AppError_1.default(404, "This user is not found!");
        }
        // checking if the user is alrady deleted.
        const isDeleted = user.isDeleted;
        if (isDeleted) {
            throw new AppError_1.default(403, "This user is deleted!");
        }
        // checking if the user is blocked
        const userStatus = user.status;
        if (userStatus === "blocked") {
            throw new AppError_1.default(403, "This user is blocked!");
        }
        // cheking user role is correct.
        // console.log(user.role, role)
        if (user.role !== role) {
            throw new AppError_1.default(403, "This user role is incoorect!");
        }
        // checking if the password change time.
        if (user.passwordChangedAt) {
            const isPasswordChanged = user_model_1.User.isJWTIssuedAtBeforePasswordChanged(user.passwordChangedAt, iat);
            if (isPasswordChanged) {
                throw new AppError_1.default(401, "You are not authorized!");
            }
        }
        // checking requiredRole access or not.
        if (requiredRole && !requiredRole.includes(role)) {
            throw new AppError_1.default(401, "You are not authorized!");
        }
        // set the user to the request object.
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
