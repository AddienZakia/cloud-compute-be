import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        error: "Name must be min 3 characters",
      })
      .max(20, { error: "Name must be max 20 characters" }),
    email: z.email(),
    password: z.string().min(8, { error: "Password must be min 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { error: "Confirm password must be min 8 characters" }),
  })
  .refine((val) => val.password === val.confirm_password, {
    message: "Confirm password doesn't match with password",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "Password must be min 8 characters" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, { error: "Password must be min 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { error: "Confirm password must be min 8 characters" }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Confirm password doesn't match with password",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const sendVerifySchema = z.object({
  email: z.email(),
});

export type registerRequestDTO = z.infer<typeof registerSchema>;
export type loginRequestDTO = z.infer<typeof loginSchema>;
export type forgotPasswordRequestDTO = z.infer<typeof forgotPasswordSchema>;
export type resetPasswordRequestDTO = z.infer<typeof resetPasswordSchema>;
export type verifyEmailRequestDTO = z.infer<typeof verifyEmailSchema>;
export type sendVerifyRequestDTO = z.infer<typeof sendVerifySchema>;
