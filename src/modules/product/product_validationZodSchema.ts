import { z } from "zod";

const productTagsSchema = z
  .array(
    z
      .string({ required_error: "Tags is required!" })
      .min(3, "Product tag must be at least 3 characters long.")
      .max(30, "Product tag cannot exceed 30 characters."),
    {
      required_error: "Tags must be an array of strings.",
    }
  )
  .nonempty("Tags cannot be empty!")
  .max(30, { message: "Tags cannot exceed 30 items!" });

const createProductValidationZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Product name is required." })
      .min(5, "Product name must be at least 5 characters long.")
      .max(200, "Product name cannot exceed 200 characters."),

    description: z
      .string({ required_error: "Product description is required." })
      .min(10, "Description should be at least 10 characters long.")
      .max(3000, "Description should not exceed 3000 characters.")
      .optional(),

    category: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid category ID format. Must be a valid MongoDB ObjectId."
      )
      .optional(),

    brand: z
      .string({ required_error: "Brand name is required." })
      .min(2, "Brand name must be at least 2 characters long.")
      .max(20, "Brand name cannot exceed 20 characters.")
      .optional(),

    model: z
      .string()
      .min(2, "Model name must be at least 2 characters long.")
      .max(50, "Model name cannot exceed 50 characters.")
      .optional(),

    costing: z
      .string({ required_error: "Costing is required." })
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Costing must be a valid number in string format (e.g., '99.99')."
      ),
    price: z
      .string({ required_error: "Price is required." })
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Price must be a valid number in string format (e.g., '99.99')."
      ),

    stock: z
      .number({ required_error: "Stock quantity is required." })
      .int("Stock must be an integer.")
      .nonnegative("Stock cannot be negative."),

    code: z
      .string({ required_error: "Product code is required!" })
      .min(2, "code must be at least 2 characters long.")
      .max(20, "Product code cannot exceed 20 characters."),

    isActive: z.boolean().default(true).optional(),

    discountPrice: z
      .string()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Discount price must be a valid number in string format (e.g., '49.99')."
      )
      .optional(),

    tags: productTagsSchema.optional(),
  }),
});

export const ProductValidation = { createProductValidationZodSchema };
