import { Router } from "express";
import {
  deleteFileController,
  uploadMultipleController,
  uploadSingleController,
} from "../controllers/upload.controller";
import { uploadImageMemory } from "../middlewares/file-uploads.middleware";

const route = Router();

// POST /api/v1/upload (single image upload, field name 'file' or 'image')
route.post("/", uploadImageMemory.single("file"), uploadSingleController);

// POST /api/v1/upload/image (alternative specific route for image upload)
route.post("/image", uploadImageMemory.single("image"), uploadSingleController);

// POST /api/v1/upload/multiple (multiple image uploads, max 10 files)
route.post(
  "/multiple",
  uploadImageMemory.array("files", 10),
  uploadMultipleController,
);

// DELETE /api/v1/upload (delete blob by URL or blobName)
route.delete("/", deleteFileController);

export default route;
