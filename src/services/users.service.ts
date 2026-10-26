import bcrypt from "bcrypt";
import { Request } from "express";
import { z } from "zod";
import { JWTPayload } from "../constants/jwt";
import { GetMeResponseDTO } from "../dto/response/users/get-me.response.dto";
import { UsersRepo } from "../repositories/users.repositories";
import { UsersType } from "../types/users";
import { ApiError } from "../utils/error-handler";
import { PaginatedResponse } from "../utils/pagination";
import { successResponse } from "../utils/success-response";
import {
  paginationQueryDTO,
  paginationSchema,
} from "../validations/pagination.schema";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/users.schema";

export const getMeService = async (data: JWTPayload) => {
  if (!data) {
    throw new ApiError(401, "You're not allowed");
  }

  const user = await UsersRepo.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const dataResponse: UsersType = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phoneNumber: user.phoneNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const response: GetMeResponseDTO = successResponse(
    200,
    "Success get user profile",
    dataResponse,
  );

  return { data: dataResponse, response };
};

export const createUserService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const validate = createUserSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const { name, email, password, role, phone_number } = validate.data;

  const exist = await UsersRepo.findUnique({
    where: { email },
  });

  if (exist) {
    throw new ApiError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersRepo.create({
    data: {
      name,
      email,
      password: hashPassword,
      role: role || "USER",
      phoneNumber: phone_number || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return successResponse(201, "Successfully created user", newUser);
};

export const editUserService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const userId = req.params?.id || req.user?.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const validateData = updateUserSchema.safeParse(req.body);

  if (!validateData.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validateData.error).fieldErrors,
    );
  }

  const { name, email, phone_number, role, password } = validateData.data;

  const exist = await UsersRepo.findUnique({
    where: {
      id: userId,
    },
  });

  if (!exist) {
    throw new ApiError(404, "User not found");
  }

  if (email && email !== exist.email) {
    const emailUsed = await UsersRepo.findUnique({
      where: { email },
    });

    if (emailUsed) {
      throw new ApiError(409, "Email already in use");
    }
  }

  let hashPassword: string | undefined;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }

  // Only allow updating role if current request user is ADMIN
  const canUpdateRole = req.user?.role === "ADMIN";

  const updatedUser = await UsersRepo.update({
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(hashPassword ? { password: hashPassword } : {}),
      ...(canUpdateRole && role ? { role } : {}),
      ...(phone_number !== undefined ? { phoneNumber: phone_number } : {}),
    },
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return successResponse(200, "Successfully updated user profile", updatedUser);
};

export const getSpecificUserService = async (userId: string) => {
  const user = await UsersRepo.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  return successResponse(200, "Success retrieve user data", user);
};

export const getAllUsersService = async (
  paginationQuery: paginationQueryDTO,
) => {
  const validatePagination = paginationSchema.safeParse(paginationQuery);

  if (!validatePagination.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validatePagination.error).fieldErrors,
    );
  }

  const paginationData = validatePagination.data;
  const { items, total_data } = await UsersRepo.paginate(
    {
      skip: (paginationData.page - 1) * paginationData.take,
      take: paginationData.take,
      orderBy: { [paginationData.sort_by || "createdAt"]: paginationData.sort },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    {},
  );

  return successResponse(
    200,
    "Success retrieve users list",
    PaginatedResponse(items, {
      page: paginationData.page,
      take: paginationData.take,
      total_data,
      total_page: Math.ceil(total_data / paginationData.take),
    }),
  );
};

export const deleteUserService = async (userId: string) => {
  const exist = await UsersRepo.findUnique({ where: { id: userId } });
  if (!exist) {
    throw new ApiError(404, "User not found");
  }

  await UsersRepo.delete({ where: { id: userId } });
  return successResponse(200, "Successfully deleted user");
};
