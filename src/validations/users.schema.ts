import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
});

export type updateUserType = z.infer<typeof updateUserSchema>;
