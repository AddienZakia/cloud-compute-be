import { z } from "zod";

export const getIdParamsSchema = z.object({
  id: z.string().min(1, "Invalid id parameter"),
});

export type getIdParamsDTO = z.infer<typeof getIdParamsSchema>;
