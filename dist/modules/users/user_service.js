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
exports.UserServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user_model");
const client_model_1 = require("../client/client_model");
const auth_utils_1 = require("../auth/auth_utils");
const config_1 = __importDefault(require("../../config"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //checking , user already exists or not.
    if (yield user_model_1.User.isUserAlreadyExistsBy_email(payload.email)) {
        throw new AppError_1.default(400, "This user already exists!");
    }
    const clientData = {};
    //create a session
    const session = yield mongoose_1.default.startSession();
    try {
        //start session.
        session.startTransaction();
        //apply transaction 1
        const newUser = yield user_model_1.User.create([payload], { session });
        if (!newUser.length) {
            throw new AppError_1.default(400, "Failed to Create User");
        }
        //set client information from user data.
        clientData._id = newUser[0]._id;
        clientData.email = newUser[0].email;
        clientData.name = payload.name;
        //apply transaction 2
        const newClient = yield client_model_1.Client.create([clientData], { session });
        if (!newClient.length) {
            throw new AppError_1.default(400, "Failed to Create User");
        }
        // transaction success then data save.
        yield session.commitTransaction();
        // set jwt payload for token.
        const jwtPayload = {
            user_id: newUser[0]._id,
            role: newUser[0].role,
        };
        // create a access token
        const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
        //create a refresh token
        const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expires_in);
        //return access and refresh token.
        return { accessToken, refreshToken };
    }
    catch (err) {
        //session cancel.
        yield session.abortTransaction();
        throw new AppError_1.default(400, err.message);
    }
    finally {
        //end session
        yield session.endSession();
    }
});
exports.UserServices = {
    createUserIntoDB,
};
