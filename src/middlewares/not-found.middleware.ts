import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const notFoundMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(new Error(`API ${req.method} - ${req.originalUrl} not found`));
  res.status(404).json({
    status: 404,
    message: `API: ${req.method} - ${req.originalUrl} not found`,
  });
};
