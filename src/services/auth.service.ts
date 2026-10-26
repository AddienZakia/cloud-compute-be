import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config/config";
import { JWTPayload } from "../constants/jwt";
import { loginResponseDTO } from "../dto/response/auth/login.response.dto";
import { registerResponseDTO } from "../dto/response/auth/register.response.dto";
import { DriversRepo } from "../repositories/drivers.repositories";
import { MerchantsRepo } from "../repositories/merchants.repositories";
import { UsersRepo } from "../repositories/users.repositories";
import { ApiError } from "../utils/error-handler";
import { successResponse } from "../utils/success-response";
import { loginSchema, registerSchema } from "../validations/auth.schema";

const COOLDOWN_JWT = config.COOLDOWN_JWT * 60; // in seconds for jsonwebtoken expiresIn

export const registerService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<registerResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = registerSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations Error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const existingUser = await UsersRepo.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashPassword = await bcrypt.hash(data.password, 10);

  await UsersRepo.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashPassword,
      role: "USER",
      phoneNumber: data.phoneNumber || "",
    },
  });

  const response: registerResponseDTO = successResponse(
    201,
    "Success register user",
  );
  return response;
};

export const loginService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<loginResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = loginSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations Error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const user = await UsersRepo.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const validatePassword = await bcrypt.compare(data.password, user.password);
  if (!validatePassword) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const jwtData: JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(
    jwtData,
    process.env.JWT_SECRET || "default_jwt_secret",
    {
      expiresIn: COOLDOWN_JWT,
    },
  );

  const resultData = { token, role: user.role };
  const response: loginResponseDTO = successResponse(
    200,
    "Login successful",
    resultData,
  );

  return response;
};

export const loginDriverService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<loginResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = loginSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations Error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const driver = await DriversRepo.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!driver) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const validatePassword = await bcrypt.compare(data.password, driver.password);
  if (!validatePassword) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const jwtData: JWTPayload = {
    id: driver.id,
    email: driver.email,
    role: "DRIVER",
  };

  const token = jwt.sign(
    jwtData,
    process.env.JWT_SECRET || "default_jwt_secret",
    {
      expiresIn: COOLDOWN_JWT,
    },
  );

  const resultData = { token, role: "DRIVER" };
  const response: loginResponseDTO = successResponse(
    200,
    "Driver login successful",
    resultData,
  );

  return response;
};

export const loginMerchantService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<loginResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = loginSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations Error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const merchant = await MerchantsRepo.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!merchant) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!merchant.status) {
    throw new ApiError(403, "Merchant account is inactive or suspended");
  }

  const validatePassword = await bcrypt.compare(
    data.password,
    merchant.password,
  );
  if (!validatePassword) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const jwtData: JWTPayload = {
    id: merchant.id,
    email: merchant.email,
    role: "MERCHANT",
  };

  const token = jwt.sign(
    jwtData,
    process.env.JWT_SECRET || "default_jwt_secret",
    {
      expiresIn: COOLDOWN_JWT,
    },
  );

  const resultData = { token, role: "MERCHANT" };
  const response: loginResponseDTO = successResponse(
    200,
    "Merchant login successful",
    resultData,
  );

  return response;
};
