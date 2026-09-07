import { z } from "zod";

type PrismaSelectFromZod<T extends z.ZodRawShape> = {
  [K in keyof T]: T[K] extends z.ZodObject<infer R>
    ? { select: PrismaSelectFromZod<R> }
    : true;
};

export function zodToPrismaSelect<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
): PrismaSelectFromZod<T> {
  const shape = schema.def.shape;
  const select: any = {};

  for (const key in shape) {
    const field = shape[key];

    if (field instanceof z.ZodObject) {
      select[key] = {
        select: zodToPrismaSelect(field),
      };
    } else {
      select[key] = true;
    }
  }

  return select;
}

export function camelToSnake(obj: any): any {
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }

  if (obj !== null && typeof obj === "object") {
    const result: any = {};

    for (const key in obj) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      result[snakeKey] = camelToSnake(obj[key]);
    }

    return result;
  }

  return obj;
}
