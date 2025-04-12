"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid Email Format!"),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const changePasswordValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: "Old password is required!" }),
        newPassword: zod_1.z
            .string({ required_error: "Password is required!" })
            .superRefine((password, ctx) => {
            if (password.length < 8 || password.length > 20) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must be between 8 and 20 characters long.",
                });
            }
            if (!/[a-z]/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one lowercase letter.",
                });
            }
            if (!/[A-Z]/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one uppercase letter.",
                });
            }
            if (!/\d/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one number.",
                });
            }
            if (!/[@$!%*?&]/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one special character (@, $, !, %, *, ?, &).",
                });
            }
        }),
    }),
});
const refreshTokenCookiesValidationZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: "Refresh token is required!" }),
    }),
});
const forgotPasswordValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required!" })
            .min(1, { message: "Email is required!" })
            .email("Invalid Email Format!"),
    }),
});
const verifyOTPValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required!" })
            .email("Invalid Email Format!"),
        otp: zod_1.z
            .string({ required_error: "OTP is required!" })
            .length(6, { message: "OTP must be exactly 6 digits!" })
            .regex(/^\d+$/, "OTP must contain only numeric characters!"),
    }),
});
const resetPasswordValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required!" })
            .email("Invalid Email Format!"),
        newPassword: zod_1.z
            .string({ required_error: "Password is required!" })
            .superRefine((password, ctx) => {
            if (password.length < 8 || password.length > 20) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must be between 8 and 20 characters long.",
                });
            }
            if (!/[a-z]/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one lowercase letter.",
                });
            }
            if (!/[A-Z]/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one uppercase letter.",
                });
            }
            if (!/\d/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one number.",
                });
            }
            if (!/[@$!%*?&]/.test(password)) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Password must include at least one special character (@, $, !, %, *, ?, &).",
                });
            }
        }),
    }),
});
exports.AuthValidation = {
    loginValidationZodSchema,
    changePasswordValidationZodSchema,
    refreshTokenCookiesValidationZodSchema,
    forgotPasswordValidationZodSchema,
    verifyOTPValidationZodSchema,
    resetPasswordValidationZodSchema,
};
