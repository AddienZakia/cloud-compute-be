import { NextFunction, Request, Response } from "express";
import {
  createMerchantService,
  deleteMerchantService,
  editMerchantService,
  getAllMerchantsService,
  getMerchantStatsService,
  getSpecificMerchantService,
} from "../services/merchants.service";
import { getIdParamsSchema } from "../validations/common.schema";
import { paginationSchema } from "../validations/pagination.schema";

export const createMerchantController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await createMerchantService(req);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllMerchantsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const response = await getAllMerchantsService(pagination);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getSpecificMerchantController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await getSpecificMerchantService(params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const editMerchantController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await editMerchantService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteMerchantController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await deleteMerchantService(params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getMerchantStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getMerchantStatsService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
