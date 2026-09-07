import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v4 } from "uuid";
import { ApiError } from "../utils/error-handler";

export const fileStorage = multer.diskStorage({
  destination: "public/files",
  filename: (
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ): void => {
    callback(null, `${v4()}-${file.originalname}`);
  },
});

export const requiredFiles = (mimeType: string[], errorFiles: string) => {
  return (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    if (mimeType.includes(file.mimetype)) callback(null, true);
    else callback(new ApiError(400, `Only ${errorFiles} format are allowed`));
  };
};
