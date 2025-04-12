"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const order_constants_1 = require("./order_constants");
const orderProductSchema = zod_1.z.object({
    productId: zod_1.z
        .string({
        required_error: "Product ID is required!",
        invalid_type_error: "Product ID must be a string.",
    })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format. Must be a valid MongoDB ObjectId."),
    quantity: zod_1.z
        .number({ required_error: "Product quantity is required." })
        .int("Product must be an integer.")
        .nonnegative("Quantity cannot be negative.")
        .min(1, "Quantity must be at least 1."),
});
const createOrderValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required!",
            invalid_type_error: "Email must be a string.",
        })
            .email("Invalid email address!")
            .optional(),
        name: zod_1.z
            .string({
            required_error: "Name is required!",
            invalid_type_error: "Name must be a string.",
        })
            .min(1, "Name is required!")
            .trim()
            .optional(),
        phone: zod_1.z
            .string({ required_error: "Phone is required!" })
            .length(11, { message: "Phone number must be exactly 11 digits." })
            .regex(/^[0-9]+$/, { message: "Phone number can only contain numbers." })
            .refine((val) => val.startsWith("01"), {
            message: "Phone number must start with 01.",
        }),
        location: zod_1.z
            .string({
            invalid_type_error: "Location must be a string.",
        })
            .min(10)
            .max(120)
            .trim(),
        note: zod_1.z
            .string({
            invalid_type_error: "Note must be a string.",
        })
            .min(3)
            .max(200)
            .trim()
            .optional(),
        products: zod_1.z
            .array(orderProductSchema, {
            required_error: "Products are required!",
            invalid_type_error: "Products must be an array.",
        })
            .min(1, "At least one product is required.")
            .nonempty("Products are required!"),
        isFullPay: zod_1.z.boolean({ required_error: "Payment method is required!" }),
    }),
});
const updateOrderStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        deliveryStatus: zod_1.z
            .enum([...order_constants_1.deliveryStatus], {
            required_error: "Delivery status is required!",
        })
            .optional(),
        adminNote: zod_1.z
            .string({ required_error: "Admin note is required!" })
            .min(5)
            .max(200)
            .optional(),
        isDeleted: zod_1.z.boolean().default(false).optional(),
    }),
});
exports.OrderValidation = {
    createOrderValidationZodSchema,
    updateOrderStatusZodSchema,
};
