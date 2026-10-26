import { NextFunction, Request, Response } from "express";
import { AppRole } from "../constants/jwt";
import { ApiError } from "../utils/error-handler";

export const authorization = (...args: AppRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.user && !args.includes(req.user.role)) {
      throw new ApiError(403, "You're not allowed");
    }

    next();
  };
};
