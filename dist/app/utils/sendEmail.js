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
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, emailTemplate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: config_1.default.email_host_provider_name,
            port: Number(config_1.default.email_host_provider_port),
            // secure: config.NODE_ENV === 'production' || false,
            secure: false,
            // secure: true,
            auth: {
                user: config_1.default.email_sender_email,
                pass: config_1.default.email_sender_email_app_pass,
            },
        });
        // send mail with defined transport object
        yield transporter.sendMail({
            from: config_1.default.email_sender_email, // sender address
            to, // list of receivers
            subject: emailTemplate.subject, // Subject line
            text: (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.text) ? emailTemplate.text : "", // plain text body
            html: emailTemplate.emailBody, // html body
        });
    }
    catch (err) {
        throw new AppError_1.default(400, err.message);
    }
});
exports.default = sendEmail;
