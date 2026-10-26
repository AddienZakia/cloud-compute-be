import { Request } from "express";
import { z } from "zod";
import { TransactionsRepo } from "../repositories/transactions.repositories";
import { ApiError } from "../utils/error-handler";
import { PaginatedResponse } from "../utils/pagination";
import { successResponse } from "../utils/success-response";
import {
  paginationQueryDTO,
  paginationSchema,
} from "../validations/pagination.schema";
import { updateTransactionSchema } from "../validations/transactions.schema";

const transactionIncludes = {
  order: {
    select: {
      id: true,
      userId: true,
      merchantId: true,
      driverId: true,
      status: true,
      deliveryAddress: true,
      createdAt: true,
    },
  },
};

export const getAllTransactionsService = async (
  req: Request,
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

  // Filter based on role
  const where: any = {};
  if (req.user?.role === "USER") {
    where.order = { userId: req.user.id };
  } else if (req.user?.role === "MERCHANT") {
    where.order = { merchantId: req.user.id };
  }

  const { items, total_data } = await TransactionsRepo.paginate(
    {
      where,
      skip: (paginationData.page - 1) * paginationData.take,
      take: paginationData.take,
      orderBy: { [paginationData.sort_by || "createdAt"]: paginationData.sort },
      include: transactionIncludes,
    },
    { where },
  );

  return successResponse(
    200,
    "Success retrieve transactions list",
    PaginatedResponse(items, {
      page: paginationData.page,
      take: paginationData.take,
      total_data,
      total_page: Math.ceil(total_data / paginationData.take),
    }),
  );
};

export const getSpecificTransactionService = async (
  req: Request,
  transactionId: string,
) => {
  const transaction = await TransactionsRepo.findUnique({
    where: { id: transactionId },
    include: transactionIncludes,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  const transactionData = transaction as typeof transaction & {
    order?: { userId: string; merchantId: string };
  };

  // Authorization check
  const role = req.user?.role;
  const userId = req.user?.id;
  if (
    role !== "ADMIN" &&
    transactionData.order?.userId !== userId &&
    transactionData.order?.merchantId !== userId
  ) {
    throw new ApiError(403, "You're not allowed to view this transaction");
  }

  return successResponse(
    200,
    "Success retrieve transaction detail",
    transaction,
  );
};

export const updateTransactionStatusService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const transactionId = req.params.id;
  const validate = updateTransactionSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const { status } = validate.data;

  const exist = await TransactionsRepo.findUnique({
    where: { id: transactionId },
  });
  if (!exist) {
    throw new ApiError(404, "Transaction not found");
  }

  const updated = await TransactionsRepo.update({
    where: { id: transactionId },
    data: {
      status,
      paidAt: status === "success" ? new Date() : null,
    },
    include: transactionIncludes,
  });

  return successResponse(
    200,
    "Successfully updated transaction status",
    updated,
  );
};
