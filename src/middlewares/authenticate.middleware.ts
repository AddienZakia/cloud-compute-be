import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../constants/jwt";
import { ApiError } from "../utils/error-handler";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const headersAuth = req.headers.authorization;
  if (!headersAuth) {
    throw new ApiError(401, "Missing authorization headers");
  }

  const bearerToken = headersAuth.startsWith("Bearer ");
  if (!bearerToken) {
    throw new ApiError(401, "Invalid authorization format token");
  }

  const token = headersAuth.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;

    next();
  } catch (err) {
    // next(err);
    throw new ApiError(401, "Invalid or malformed access token");
  }
};
