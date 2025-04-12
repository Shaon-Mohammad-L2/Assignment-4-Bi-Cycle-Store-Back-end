import { string, z } from "zod";
import { deliveryStatus } from "./order_constants";

const orderProductSchema = z.object({
  productId: z
    .string({
      required_error: "Product ID is required!",
      invalid_type_error: "Product ID must be a string.",
    })
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid Product ID format. Must be a valid MongoDB ObjectId."
    ),
  quantity: z
    .number({ required_error: "Product quantity is required." })
    .int("Product must be an integer.")
    .nonnegative("Quantity cannot be negative.")
    .min(1, "Quantity must be at least 1."),
});

const createOrderValidationZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required!",
        invalid_type_error: "Email must be a string.",
      })
      .email("Invalid email address!")
      .optional(),

    name: z
      .string({
        required_error: "Name is required!",
        invalid_type_error: "Name must be a string.",
      })
      .min(1, "Name is required!")
      .trim()
      .optional(),

    phone: z
      .string({ required_error: "Phone is required!" })
      .length(11, { message: "Phone number must be exactly 11 digits." })
      .regex(/^[0-9]+$/, { message: "Phone number can only contain numbers." })
      .refine((val) => val.startsWith("01"), {
        message: "Phone number must start with 01.",
      }),
    location: z
      .string({
        invalid_type_error: "Location must be a string.",
      })
      .min(10)
      .max(120)
      .trim(),
    note: z
      .string({
        invalid_type_error: "Note must be a string.",
      })
      .min(3)
      .max(200)
      .trim()
      .optional(),

    products: z
      .array(orderProductSchema, {
        required_error: "Products are required!",
        invalid_type_error: "Products must be an array.",
      })
      .min(1, "At least one product is required.")
      .nonempty("Products are required!"),
    isFullPay: z.boolean({ required_error: "Payment method is required!" }),
  }),
});

const updateOrderStatusZodSchema = z.object({
  body: z.object({
    deliveryStatus: z
      .enum([...(deliveryStatus as [string, ...string[]])], {
        required_error: "Delivery status is required!",
      })
      .optional(),
    adminNote: z
      .string({ required_error: "Admin note is required!" })
      .min(5)
      .max(200)
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const OrderValidation = {
  createOrderValidationZodSchema,
  updateOrderStatusZodSchema,
};
