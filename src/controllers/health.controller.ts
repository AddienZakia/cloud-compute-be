import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/success-response";

export const healthController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const healthcheck = {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };

    const response = successResponse(
      200,
      "Success check health API",
      healthcheck,
    );
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
