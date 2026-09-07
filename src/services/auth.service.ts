import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config/config";
import { JWTPayload } from "../constants/jwt";
import { forgotPasswordResponseDTO } from "../dto/response/auth/forgot-password.response.dto";
import { loginResponseDTO } from "../dto/response/auth/login.response.dto";
import { registerResponseDTO } from "../dto/response/auth/register.response.dto";
import { resetPassworrdResponseDTO } from "../dto/response/auth/reset-password.response.dto";
import { sendVerifyResponseDTO } from "../dto/response/auth/send-verify.response.dto";
import { verifyEmailResponseDTO } from "../dto/response/auth/verify-email.response.dto";
import { UsersRepo } from "../repositories/users.repositories";
import { sendEmailType } from "../types/send-email";
import { ApiError } from "../utils/error-handler";
import { sendEmail } from "../utils/send-email";
import { successResponse } from "../utils/success-response";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendVerifySchema,
  verifyEmailSchema,
} from "../validations/auth.schema";

const COOLDOWN_VERIFY = config.COOLDOWN_VERIFY * 60 * 1000;
const COOLDOWN_RESET = config.COOLDOWN_RESET * 60 * 1000;
const COOLDOWN_JWT = config.COOLDOWN_JWT * 60 * 1000;

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

  const user = await UsersRepo.findOne({
    where: {
      email: data.email,
    },
  });

  if (user) {
    if (user.isVerified) {
      throw new ApiError(409, "Email already registered");
    }

    if (!user.isVerified) {
      if (
        user.lastSendVerify &&
        Date.now() - user.lastSendVerify.getTime() > COOLDOWN_VERIFY
      ) {
        const token = crypto.randomBytes(32).toString("hex");
        const hashToken = crypto
          .createHmac("sha256", process.env.TOKEN_SECRET || "default_token_secret")
          .update(token)
          .digest("hex");
        const expiredDate = new Date(Date.now() + COOLDOWN_VERIFY);

        await UsersRepo.update({
          data: {
            verifyToken: hashToken,
            verifyTokenExpires: expiredDate,
            lastSendVerify: new Date(),
          },
          where: {
            id: user.id,
          },
        });

        const registerData: sendEmailType = {
          type: "verify",
          title: "Verify your Email",
          name: data.name,
          link: `${config.BASE_URL}/auth/verify-email?token=${token}`,
        };

        sendEmail(data.email, "Verify your email", registerData);
      }

      throw new ApiError(409, "Email isn't verified. Please check your email");
    }
  }

  const hashPassword = await bcrypt.hash(data.password, 10);

  if (!user) {
    const token = crypto.randomBytes(32).toString("hex");
    const hashToken = crypto
      .createHmac("sha256", process.env.TOKEN_SECRET || "default_token_secret")
      .update(token)
      .digest("hex");
    const expiredDate = new Date(Date.now() + COOLDOWN_VERIFY);

    await UsersRepo.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
        role: "USER",
        isVerified: false,
        verifyToken: hashToken,
        verifyTokenExpires: expiredDate,
        lastSendVerify: new Date(),
        phoneNumber: "",
      },
    });

    const registerData: sendEmailType = {
      type: "verify",
      title: "Verify your Email",
      name: data.name,
      link: `${config.BASE_URL}/auth/verify-email?token=${token}`,
    };

    sendEmail(data.email, "Verify your email", registerData);
  }

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

  const user = await UsersRepo.findOne({
    where: {
      email: data.email,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  if (user && !user.isVerified) {
    throw new ApiError(403, "Please verify your email before continue");
  }

  const validatePassword = await bcrypt.compareSync(
    data.password,
    user.password,
  );
  if (!validatePassword) throw new ApiError(401, "Invalid email or password.");

  const jwtData: JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtData, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: COOLDOWN_JWT,
  });

  const resultData = { token, role: user.role };
  const response: loginResponseDTO = successResponse(
    200,
    "Login successful",
    resultData,
  );

  return response;
};

export const forgotPasswordService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<forgotPasswordResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = forgotPasswordSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validation error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const user = await UsersRepo.findOne({
    where: {
      email: data.email,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  if (user && !user.isVerified) {
    throw new ApiError(403, "Please verify your email before continue");
  }

  if (
    user &&
    user.lastSendReset &&
    Date.now() - user.lastSendReset.getTime() < COOLDOWN_RESET
  ) {
    throw new ApiError(
      429,
      "Too many requests, please wait 10 minutes before requesting again",
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto
    .createHmac("sha256", process.env.TOKEN_SECRET || "default_token_secret")
    .update(token)
    .digest("hex");
  const expiredDate = new Date(Date.now() + COOLDOWN_RESET);

  await UsersRepo.update({
    data: {
      resetToken: hashToken,
      resetTokenExpires: expiredDate,
      lastSendReset: new Date(),
    },
    where: {
      id: user.id,
    },
  });

  const resetData: sendEmailType = {
    type: "verify",
    title: "Reset your Password",
    name: user.name,
    link: `${config.BASE_URL}/auth/reset-password?token=${token}`,
  };

  sendEmail(data.email, "Recover your account", resetData);

  const response: forgotPasswordResponseDTO = successResponse(
    200,
    "Reset password link has been sent",
  );
  return response;
};

export const resetPasswordService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<resetPassworrdResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = resetPasswordSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const hashToken = crypto
    .createHmac("sha256", process.env.TOKEN_SECRET || "default_token_secret")
    .update(data.token)
    .digest("hex");

  const user = await UsersRepo.findOne({
    where: {
      resetToken: hashToken,
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new ApiError(400, "Invalid or expired reset token");

  const hashPassword = bcrypt.hashSync(data.password, 10);

  await UsersRepo.update({
    data: {
      password: hashPassword,
      resetToken: null,
      resetTokenExpires: null,
      lastSendReset: null,
    },
    where: {
      id: user.id,
      isVerified: true,
    },
  });

  const response: resetPassworrdResponseDTO = successResponse(
    200,
    "Your password has been reset successfully",
  );

  return response;
};

export const verifyEmailService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<verifyEmailResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = verifyEmailSchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const hashToken = crypto
    .createHmac("sha256", process.env.TOKEN_SECRET || "default_token_secret")
    .update(data.token)
    .digest("hex");

  const user = await UsersRepo.findOne({
    where: {
      isVerified: false,
      verifyToken: hashToken,
      verifyTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new ApiError(400, "Invalid or expired verify token");

  await UsersRepo.update({
    data: {
      isVerified: true,
      verifyToken: null,
      verifyTokenExpires: null,
      lastSendVerify: null,
    },
    where: {
      id: user.id,
    },
  });

  const response: verifyEmailResponseDTO = successResponse(
    200,
    "Email successfully verified",
  );

  return response;
};

export const sendVerifyTokenService = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<sendVerifyResponseDTO> => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const data = req.body;
  const validate = sendVerifySchema.safeParse(data);

  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const user = await UsersRepo.findOne({
    where: {
      email: data.email,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  if (user && user.isVerified) throw new ApiError(409, "User already verified");

  const token = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto
    .createHmac("sha256", process.env.TOKEN_SECRET || "default_token_secret")
    .update(token)
    .digest("hex");
  const expiredDate = new Date(Date.now() + COOLDOWN_VERIFY);

  await UsersRepo.update({
    data: {
      verifyToken: hashToken,
      verifyTokenExpires: expiredDate,
      lastSendVerify: new Date(),
    },
    where: {
      id: user.id,
    },
  });

  const registerData: sendEmailType = {
    type: "verify",
    title: "Verify your Email",
    name: user.name,
    link: `${config.BASE_URL}/auth/verify-email?token=${token}`,
  };

  sendEmail(data.email, "Verify your email", registerData);

  const response: sendVerifyResponseDTO = successResponse(
    200,
    "A verification link has been sent",
  );
  return response;
};
