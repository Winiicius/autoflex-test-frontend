import { z } from "zod";

export const rawMaterialSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  stockQuantity: z.coerce.number().min(0, "Stock must be >= 0"),
});

export type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;
