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

/**
 * Memory storage multer untuk upload langsung ke cloud object storage (Azure Blob / S3)
 * tanpa perlu menyimpan file sementara di disk server.
 */
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * Memory storage multer khusus untuk file gambar (jpg, jpeg, png, webp, gif, svg)
 */
export const uploadImageMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new ApiError(
          400,
          "Only image files (jpg, jpeg, png, webp, gif, svg) are allowed",
        ),
      );
    }
  },
});

/**
 * Middleware fleksibel untuk upload single image ke memory.
 * Mendukung berbagai nama field umum: 'image', 'file', 'imageUrl', atau field khusus yang dispesifikasikan.
 * Otomatis menaruh file yang ditemukan ke `req.file`.
 * Jika request adalah JSON biasa atau tidak ada file yang diunggah, request tetap lanjut normal.
 */
export const uploadSingleImage = (preferredFieldName?: string) => {
  const fieldList = Array.from(
    new Set([preferredFieldName || "image", "image", "file", "imageUrl"]),
  ).map((name) => ({ name, maxCount: 1 }));

  return (req: Request, res: any, next: any) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return next();
    }

    uploadImageMemory.fields(fieldList)(req, res, (err) => {
      if (err) {
        return next(err);
      }

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      if (files) {
        req.file =
          (preferredFieldName ? files[preferredFieldName]?.[0] : undefined) ||
          files["image"]?.[0] ||
          files["file"]?.[0] ||
          files["imageUrl"]?.[0] ||
          undefined;
      }

      next();
    });
  };
};
