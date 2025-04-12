"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Name is required!" })
            .min(2, { message: "Name is required!" }),
        email: zod_1.z
            .string({ required_error: "Email is required!" })
            .min(1, { message: "Email is required!" })
            .email("Invalid Email Format!"),
        password: zod_1.z
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
exports.UserValidation = {
    createUserValidationZodSchema,
};
