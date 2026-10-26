import { NextFunction, Request, Response } from "express";
import {
  deleteFileService,
  uploadMultipleService,
  uploadSingleService,
} from "../services/upload.service";

export const uploadSingleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const folder = (req.body?.folder as string) || undefined;
    const { response } = await uploadSingleService(req.file, folder);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const folder = (req.body?.folder as string) || undefined;
    const files = req.files as Express.Multer.File[];
    const { response } = await uploadMultipleService(files, folder);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteFileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blobNameOrUrl = (req.body?.blobName || req.body?.url) as string;
    const { response } = await deleteFileService(blobNameOrUrl);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};
