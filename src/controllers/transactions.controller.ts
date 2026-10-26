import { NextFunction, Request, Response } from "express";
import {
  getAllTransactionsService,
  getSpecificTransactionService,
  updateTransactionStatusService,
} from "../services/transactions.service";
import { getIdParamsSchema } from "../validations/common.schema";
import { paginationSchema } from "../validations/pagination.schema";

export const getAllTransactionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const response = await getAllTransactionsService(req, pagination);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getSpecificTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await getSpecificTransactionService(req, params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const updateTransactionStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await updateTransactionStatusService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
