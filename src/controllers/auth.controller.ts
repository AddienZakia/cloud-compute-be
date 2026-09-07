import { NextFunction, Request, Response } from "express";
import {
  forgotPasswordService,
  loginService,
  registerService,
  resetPasswordService,
  sendVerifyTokenService,
  verifyEmailService,
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
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await forgotPasswordService(req, res, next);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await resetPasswordService(req, res, next);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await verifyEmailService(req, res, next);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export const sendVerifyTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await sendVerifyTokenService(req, res, next);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
