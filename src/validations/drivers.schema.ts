import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(3, "Name must be min 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be min 8 characters"),
  isAvailable: z.boolean().optional().default(true),
});

export const updateDriverSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  isAvailable: z.boolean().optional(),
});

export type createDriverType = z.infer<typeof createDriverSchema>;
export type updateDriverType = z.infer<typeof updateDriverSchema>;
