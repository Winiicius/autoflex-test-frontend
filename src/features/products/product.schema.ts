import { z } from "zod";

const materialSchema = z.object({
  rawMaterialId: z.coerce.number().int().positive("Select a material"),
  quantity: z.coerce.number().positive("Quantity must be > 0"),
});

export const productSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  materials: z
    .array(materialSchema)
    .min(1, "At least one material is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
