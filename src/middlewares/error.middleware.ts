import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const errorMiddleware = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const code = Number(err.code) || 500;

  logger.error(new Error(err.message));
  res.status(code).json({
    code,
    status: false,
    message: err.message,
    error: err.data || null,
  });
};
