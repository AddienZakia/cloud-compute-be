import { z } from "zod";

const preprocessBoolean = (val: unknown) => {
  if (typeof val === "string") {
    if (val.toLowerCase() === "true" || val === "1") return true;
    if (val.toLowerCase() === "false" || val === "0") return false;
  }
  return val;
};

export const createMerchantSchema = z.object({
  title: z.string().min(2, "Title must be min 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be min 8 characters"),
  address: z.string().min(5, "Address must be min 5 characters"),
  rating: z.coerce.number().int().min(0).max(5).optional().default(0),
  status: z.preprocess(preprocessBoolean, z.boolean().optional()).default(true),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateMerchantSchema = z.object({
  title: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  address: z.string().min(1).optional(),
  rating: z.coerce.number().int().min(0).max(5).optional(),
  status: z.preprocess(preprocessBoolean, z.boolean().optional()),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type createMerchantType = z.infer<typeof createMerchantSchema>;
export type updateMerchantType = z.infer<typeof updateMerchantSchema>;
