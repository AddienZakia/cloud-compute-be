import { z } from "zod";

const sortEnum = ["asc", "desc"] as const;
const filterEnum = ["name"];

export const paginationSchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    take: z.coerce.number().min(1).default(10),
    sort: z.enum(sortEnum),
    sort_by: z
      .string()
      .optional()
      .transform((val) => (!val || val.trim() === "" ? "createdAt" : val)),
    filter: z.string().optional(),
    filter_by: z.string().optional(),
  })
  .refine(
    (val) => {
      if (!val.filter) return true;
      return val.filter.split(",").every((f) => filterEnum.includes(f));
    },
    {
      message: "One or more selected filters are not supported",
      path: ["filter"],
    },
  )
  .refine((val) => !val.filter || !!val.filter_by, {
    message: "Missing required parameter: filter_by",
    path: ["filter_by"],
  });

export type paginationQueryDTO = z.infer<typeof paginationSchema>;
