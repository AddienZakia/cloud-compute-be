import bcrypt from "bcrypt";
import { Request } from "express";
import { z } from "zod";
import { DriversRepo } from "../repositories/drivers.repositories";
import { ApiError } from "../utils/error-handler";
import { PaginatedResponse } from "../utils/pagination";
import { successResponse } from "../utils/success-response";
import {
  createDriverSchema,
  updateDriverSchema,
} from "../validations/drivers.schema";
import {
  paginationQueryDTO,
  paginationSchema,
} from "../validations/pagination.schema";

const driverSelect = {
  id: true,
  name: true,
  email: true,
  isAvailable: true,
  createdAt: true,
  updatedAt: true,
};

export const createDriverService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const validate = createDriverSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const { name, email, password, isAvailable } = validate.data;

  const exist = await DriversRepo.findUnique({
    where: { email },
  });
  if (exist) {
    throw new ApiError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const driver = await DriversRepo.create({
    data: {
      name,
      email,
      password: hashPassword,
      isAvailable,
    },
    select: driverSelect,
  });

  return successResponse(201, "Successfully created driver", driver);
};

export const getAllDriversService = async (
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
  const { items, total_data } = await DriversRepo.paginate(
    {
      skip: (paginationData.page - 1) * paginationData.take,
      take: paginationData.take,
      orderBy: { [paginationData.sort_by || "createdAt"]: paginationData.sort },
      select: driverSelect,
    },
    {},
  );

  return successResponse(
    200,
    "Success retrieve drivers list",
    PaginatedResponse(items, {
      page: paginationData.page,
      take: paginationData.take,
      total_data,
      total_page: Math.ceil(total_data / paginationData.take),
    }),
  );
};

export const getSpecificDriverService = async (driverId: string) => {
  const driver = await DriversRepo.findUnique({
    where: { id: driverId },
    select: driverSelect,
  });

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  return successResponse(200, "Success retrieve driver data", driver);
};

export const editDriverService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const driverId = req.params?.id || req.user?.id;
  if (!driverId) {
    throw new ApiError(400, "Driver ID is required");
  }

  const validateData = updateDriverSchema.safeParse(req.body);
  if (!validateData.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validateData.error).fieldErrors,
    );
  }

  const { name, email, password, isAvailable } = validateData.data;

  const exist = await DriversRepo.findUnique({
    where: { id: driverId },
  });
  if (!exist) {
    throw new ApiError(404, "Driver not found");
  }

  if (email && email !== exist.email) {
    const emailUsed = await DriversRepo.findUnique({
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

  const updatedDriver = await DriversRepo.update({
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(hashPassword ? { password: hashPassword } : {}),
      ...(isAvailable !== undefined ? { isAvailable } : {}),
    },
    where: { id: driverId },
    select: driverSelect,
  });

  return successResponse(200, "Successfully updated driver", updatedDriver);
};

export const deleteDriverService = async (driverId: string) => {
  const exist = await DriversRepo.findUnique({ where: { id: driverId } });
  if (!exist) {
    throw new ApiError(404, "Driver not found");
  }

  await DriversRepo.delete({ where: { id: driverId } });
  return successResponse(200, "Successfully deleted driver");
};
