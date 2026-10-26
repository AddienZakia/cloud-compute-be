import { Request } from "express";
import { z } from "zod";
import { CatalogsRepo } from "../repositories/catalogs.repositories";
import { MerchantsRepo } from "../repositories/merchants.repositories";
import { ApiError } from "../utils/error-handler";
import { PaginatedResponse } from "../utils/pagination";
import { successResponse } from "../utils/success-response";
import {
  createCatalogSchema,
  updateCatalogSchema,
} from "../validations/catalogs.schema";
import {
  paginationQueryDTO,
  paginationSchema,
} from "../validations/pagination.schema";

export const createCatalogService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const validate = createCatalogSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  let merchantId = validate.data.merchantId;
  if (!merchantId && req.user?.role === "MERCHANT") {
    merchantId = req.user.id;
  }

  if (!merchantId) {
    throw new ApiError(400, "Merchant ID is required");
  }

  const merchant = await MerchantsRepo.findUnique({
    where: { id: merchantId },
  });
  if (!merchant) {
    throw new ApiError(404, "Merchant not found");
  }

  const { title, price, category, status, imageUrl } = validate.data;

  const catalog = await CatalogsRepo.create({
    data: {
      merchantId,
      title,
      price,
      category,
      status: status ?? true,
      imageUrl: imageUrl || null,
    },
    include: {
      merchant: {
        select: {
          id: true,
          title: true,
          address: true,
        },
      },
    },
  });

  return successResponse(201, "Successfully created catalog item", catalog);
};

export const getAllCatalogsService = async (
  paginationQuery: paginationQueryDTO,
  merchantId?: string,
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
  const where = merchantId ? { merchantId } : {};

  const { items, total_data } = await CatalogsRepo.paginate(
    {
      where,
      skip: (paginationData.page - 1) * paginationData.take,
      take: paginationData.take,
      orderBy: { [paginationData.sort_by || "createdAt"]: paginationData.sort },
      include: {
        merchant: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    },
    { where },
  );

  return successResponse(
    200,
    "Success retrieve catalogs list",
    PaginatedResponse(items, {
      page: paginationData.page,
      take: paginationData.take,
      total_data,
      total_page: Math.ceil(total_data / paginationData.take),
    }),
  );
};

export const getSpecificCatalogService = async (catalogId: string) => {
  const catalog = await CatalogsRepo.findUnique({
    where: { id: catalogId },
    include: {
      merchant: {
        select: {
          id: true,
          title: true,
          address: true,
        },
      },
    },
  });

  if (!catalog) {
    throw new ApiError(404, "Catalog item not found");
  }

  return successResponse(200, "Success retrieve catalog item", catalog);
};

export const editCatalogService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const catalogId = req.params.id;
  if (!catalogId) {
    throw new ApiError(400, "Catalog ID is required");
  }

  const validateData = updateCatalogSchema.safeParse(req.body);
  if (!validateData.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validateData.error).fieldErrors,
    );
  }

  const exist = await CatalogsRepo.findUnique({
    where: { id: catalogId },
  });
  if (!exist) {
    throw new ApiError(404, "Catalog item not found");
  }

  // If role is MERCHANT, only allow edit if they own the catalog
  if (req.user?.role === "MERCHANT" && exist.merchantId !== req.user.id) {
    throw new ApiError(403, "You can only edit your own catalog items");
  }

  const { title, price, category, status, imageUrl } = validateData.data;

  const updatedCatalog = await CatalogsRepo.update({
    data: {
      ...(title ? { title } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(category ? { category } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
    },
    where: { id: catalogId },
    include: {
      merchant: {
        select: {
          id: true,
          title: true,
          address: true,
        },
      },
    },
  });

  return successResponse(
    200,
    "Successfully updated catalog item",
    updatedCatalog,
  );
};

export const deleteCatalogService = async (req: Request) => {
  const catalogId = req.params.id;
  if (!catalogId) {
    throw new ApiError(400, "Catalog ID is required");
  }

  const exist = await CatalogsRepo.findUnique({
    where: { id: catalogId },
  });
  if (!exist) {
    throw new ApiError(404, "Catalog item not found");
  }

  // If role is MERCHANT, only allow delete if they own the catalog
  if (req.user?.role === "MERCHANT" && exist.merchantId !== req.user.id) {
    throw new ApiError(403, "You can only delete your own catalog items");
  }

  await CatalogsRepo.delete({ where: { id: catalogId } });
  return successResponse(200, "Successfully deleted catalog item");
};
