import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be min 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be min 8 characters"),
  role: z.enum(["ADMIN", "USER"]).optional().default("USER"),
  phone_number: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  phone_number: z.string().optional(),
});

export type createUserType = z.infer<typeof createUserSchema>;
export type updateUserType = z.infer<typeof updateUserSchema>;
