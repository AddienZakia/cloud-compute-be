import { z } from "zod";

const preprocessBoolean = (val: unknown) => {
  if (typeof val === "string") {
    if (val.toLowerCase() === "true" || val === "1") return true;
    if (val.toLowerCase() === "false" || val === "0") return false;
  }
  return val;
};

export const createCatalogSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required").optional(), // If merchant creates, can take from req.user.id
  title: z.string().min(2, "Title must be min 2 characters").max(100),
  price: z.coerce.number().int().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  status: z.preprocess(preprocessBoolean, z.boolean().optional()).default(true),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateCatalogSchema = z.object({
  merchantId: z.string().optional(),
  title: z.string().min(1).optional(),
  price: z.coerce.number().int().min(0).optional(),
  category: z.string().min(1).optional(),
  status: z.preprocess(preprocessBoolean, z.boolean().optional()),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type createCatalogType = z.infer<typeof createCatalogSchema>;
export type updateCatalogType = z.infer<typeof updateCatalogSchema>;
