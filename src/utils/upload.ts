import fs from "fs/promises";

export const formToObject = <T extends string>(
  data: Record<T, Express.Multer.File[]>,
): Record<T, Express.Multer.File[]> => {
  const objectForm: Record<string, Express.Multer.File[]> = {};

  Object.keys(data).forEach((key) => {
    objectForm[key] = data[key as T];
  });

  return objectForm;
};

export async function cleanupFiles(files: Express.Multer.File[]) {
  await Promise.all(files.map((f) => fs.unlink(f.path).catch(() => {})));
}

// Re-export Azure Blob Storage helpers
export * from "./azure-storage";
