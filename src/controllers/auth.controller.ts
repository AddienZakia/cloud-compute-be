import { NextFunction, Request, Response } from "express";
import {
  loginDriverService,
  loginMerchantService,
  loginService,
  registerService,
} from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await registerService(req, res, next);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginService(req, res, next);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginDriverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginDriverService(req, res, next);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginMerchantController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginMerchantService(req, res, next);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
