import bcrypt from "bcrypt";
import { Request } from "express";
import { z } from "zod";
import { MerchantsRepo } from "../repositories/merchants.repositories";
import { deleteBlob, uploadFileToBlob } from "../utils/azure-storage";
import { ApiError } from "../utils/error-handler";
import { logger } from "../utils/logger";
import { PaginatedResponse } from "../utils/pagination";
import { successResponse } from "../utils/success-response";
import {
  createMerchantSchema,
  updateMerchantSchema,
} from "../validations/merchants.schema";
import {
  paginationQueryDTO,
  paginationSchema,
} from "../validations/pagination.schema";

const merchantSelect = {
  id: true,
  title: true,
  email: true,
  address: true,
  rating: true,
  status: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
};

export const createMerchantService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const validate = createMerchantSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const { title, email, password, address, rating, status } = validate.data;
  let imageUrl = validate.data.imageUrl || null;

  // Jika ada file gambar di-upload di request, upload ke Azure Blob Storage
  if (req.file) {
    const uploadResult = await uploadFileToBlob(req.file, {
      folder: "merchants",
    });
    imageUrl = uploadResult.url;
  }

  const exist = await MerchantsRepo.findUnique({
    where: { email },
  });
  if (exist) {
    throw new ApiError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const merchant = await MerchantsRepo.create({
    data: {
      title,
      email,
      password: hashPassword,
      address,
      rating: rating ?? 0,
      status: status ?? true,
      imageUrl,
    },
    select: merchantSelect,
  });

  return successResponse(201, "Successfully created merchant", merchant);
};

export const getAllMerchantsService = async (
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
  const { items, total_data } = await MerchantsRepo.paginate(
    {
      skip: (paginationData.page - 1) * paginationData.take,
      take: paginationData.take,
      orderBy: { [paginationData.sort_by || "createdAt"]: paginationData.sort },
      select: merchantSelect,
    },
    {},
  );

  return successResponse(
    200,
    "Success retrieve merchants list",
    PaginatedResponse(items, {
      page: paginationData.page,
      take: paginationData.take,
      total_data,
      total_page: Math.ceil(total_data / paginationData.take),
    }),
  );
};

export const getSpecificMerchantService = async (merchantId: string) => {
  const merchant = await MerchantsRepo.findUnique({
    where: { id: merchantId },
    select: {
      ...merchantSelect,
      catalogs: {
        where: { status: true },
      },
    },
  });

  if (!merchant) {
    throw new ApiError(404, "Merchant not found");
  }

  return successResponse(200, "Success retrieve merchant data", merchant);
};

export const editMerchantService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const merchantId = req.params?.id || req.user?.id;
  if (!merchantId) {
    throw new ApiError(400, "Merchant ID is required");
  }

  const validateData = updateMerchantSchema.safeParse(req.body);
  if (!validateData.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validateData.error).fieldErrors,
    );
  }

  const { title, email, password, address, rating, status } = validateData.data;
  let imageUrl = validateData.data.imageUrl;

  const exist = await MerchantsRepo.findUnique({
    where: { id: merchantId },
  });
  if (!exist) {
    throw new ApiError(404, "Merchant not found");
  }

  // Jika ada file gambar baru yang di-upload
  if (req.file) {
    const uploadResult = await uploadFileToBlob(req.file, {
      folder: "merchants",
    });
    imageUrl = uploadResult.url;

    // Bersihkan file lama di Azure Blob Storage jika ada
    if (exist.imageUrl && exist.imageUrl.includes("blob.core.windows.net")) {
      deleteBlob(exist.imageUrl).catch((err) =>
        logger.warn(
          `Failed to cleanup old merchant image blob: ${err.message}`,
        ),
      );
    }
  }

  if (email && email !== exist.email) {
    const emailUsed = await MerchantsRepo.findUnique({
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

  const updatedMerchant = await MerchantsRepo.update({
    data: {
      ...(title ? { title } : {}),
      ...(email ? { email } : {}),
      ...(hashPassword ? { password: hashPassword } : {}),
      ...(address ? { address } : {}),
      ...(rating !== undefined ? { rating } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
    },
    where: { id: merchantId },
    select: merchantSelect,
  });

  return successResponse(200, "Successfully updated merchant", updatedMerchant);
};

export const deleteMerchantService = async (merchantId: string) => {
  const exist = await MerchantsRepo.findUnique({ where: { id: merchantId } });
  if (!exist) {
    throw new ApiError(404, "Merchant not found");
  }

  await MerchantsRepo.delete({ where: { id: merchantId } });

  // Bersihkan file di Azure Blob Storage jika ada
  if (exist.imageUrl && exist.imageUrl.includes("blob.core.windows.net")) {
    deleteBlob(exist.imageUrl).catch((err) =>
      logger.warn(
        `Failed to cleanup deleted merchant image blob: ${err.message}`,
      ),
    );
  }

  return successResponse(200, "Successfully deleted merchant");
};
