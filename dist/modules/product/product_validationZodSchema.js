"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const productTagsSchema = zod_1.z
    .array(zod_1.z
    .string({ required_error: "Tags is required!" })
    .min(3, "Product tag must be at least 3 characters long.")
    .max(30, "Product tag cannot exceed 30 characters."), {
    required_error: "Tags must be an array of strings.",
})
    .nonempty("Tags cannot be empty!")
    .max(30, { message: "Tags cannot exceed 30 items!" });
const productImageDeleteSchema = zod_1.z
    .array(zod_1.z
    .string({ required_error: "Image id is required!" })
    .min(1, "Image id must be at least 1 characters long."), {
    required_error: "Image Ids must be an array of strings.",
})
    .nonempty("Tags cannot be empty!")
    .max(30, { message: "Tags cannot exceed 30 items!" });
const createProductValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Product name is required." })
            .min(5, "Product name must be at least 5 characters long.")
            .max(200, "Product name cannot exceed 200 characters."),
        description: zod_1.z
            .string({ required_error: "Product description is required." })
            .min(10, "Description should be at least 10 characters long.")
            .max(3000, "Description should not exceed 3000 characters.")
            .optional(),
        category: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format. Must be a valid MongoDB ObjectId.")
            .optional(),
        brand: zod_1.z
            .string({ required_error: "Brand name is required." })
            .min(2, "Brand name must be at least 2 characters long.")
            .max(20, "Brand name cannot exceed 20 characters.")
            .optional(),
        model: zod_1.z
            .string()
            .min(2, "Model name must be at least 2 characters long.")
            .max(50, "Model name cannot exceed 50 characters.")
            .optional(),
        costing: zod_1.z
            .string({ required_error: "Costing is required." })
            .regex(/^\d+(\.\d{1,2})?$/, "Costing must be a valid number in string format (e.g., '99.99')."),
        price: zod_1.z
            .string({ required_error: "Price is required." })
            .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number in string format (e.g., '99.99')."),
        stock: zod_1.z
            .number({ required_error: "Stock quantity is required." })
            .int("Stock must be an integer.")
            .nonnegative("Stock cannot be negative."),
        code: zod_1.z
            .string({ required_error: "Product code is required!" })
            .min(2, "code must be at least 2 characters long.")
            .max(20, "Product code cannot exceed 20 characters."),
        isActive: zod_1.z.boolean().default(true).optional(),
        discountPrice: zod_1.z
            .string()
            .regex(/^\d+(\.\d{1,2})?$/, "Discount price must be a valid number in string format (e.g., '49.99').")
            .optional(),
        tags: productTagsSchema.optional(),
    }),
});
const updateProductValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Product name is required." })
            .min(5, "Product name must be at least 5 characters long.")
            .max(200, "Product name cannot exceed 200 characters.")
            .optional(),
        description: zod_1.z
            .string({ required_error: "Product description is required." })
            .min(10, "Description should be at least 10 characters long.")
            .max(3000, "Description should not exceed 3000 characters.")
            .optional(),
        category: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format. Must be a valid MongoDB ObjectId.")
            .optional(),
        brand: zod_1.z
            .string({ required_error: "Brand name is required." })
            .min(2, "Brand name must be at least 2 characters long.")
            .max(20, "Brand name cannot exceed 20 characters.")
            .optional(),
        model: zod_1.z
            .string()
            .min(2, "Model name must be at least 2 characters long.")
            .max(50, "Model name cannot exceed 50 characters.")
            .optional(),
        costing: zod_1.z
            .string({ required_error: "Costing is required." })
            .regex(/^\d+(\.\d{1,2})?$/, "Costing must be a valid number in string format (e.g., '99.99').")
            .optional(),
        price: zod_1.z
            .string({ required_error: "Price is required." })
            .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number in string format (e.g., '99.99').")
            .optional(),
        imageDelete: productImageDeleteSchema.optional(),
        videoDelete: productImageDeleteSchema.optional(),
        stock: zod_1.z
            .number({ required_error: "Stock quantity is required." })
            .int("Stock must be an integer.")
            .nonnegative("Stock cannot be negative.")
            .optional(),
        code: zod_1.z
            .string({ required_error: "Product code is required!" })
            .min(2, "code must be at least 2 characters long.")
            .max(20, "Product code cannot exceed 20 characters.")
            .optional(),
        discountPrice: zod_1.z
            .string()
            .regex(/^\d+(\.\d{1,2})?$/, "Discount price must be a valid number in string format (e.g., '49.99').")
            .optional(),
        tags: productTagsSchema.optional(),
        isActive: zod_1.z.boolean().default(true).optional(),
        isDeleted: zod_1.z.boolean().default(false).optional(),
    }),
});
exports.ProductValidation = {
    createProductValidationZodSchema,
    updateProductValidationZodSchema,
};
