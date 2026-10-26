import { z } from "zod";

export const updateTransactionSchema = z.object({
  status: z.enum(["pending", "failed", "success"], {
    error: "Status must be pending, failed, or success",
  }),
});

export type updateTransactionType = z.infer<typeof updateTransactionSchema>;
