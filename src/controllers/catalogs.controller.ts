import { NextFunction, Request, Response } from "express";
import {
  createCatalogService,
  deleteCatalogService,
  editCatalogService,
  getAllCatalogsService,
  getSpecificCatalogService,
} from "../services/catalogs.service";
import { getIdParamsSchema } from "../validations/common.schema";
import { paginationSchema } from "../validations/pagination.schema";

export const createCatalogController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await createCatalogService(req);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllCatalogsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const merchantId = req.query.merchantId as string | undefined;
    const response = await getAllCatalogsService(pagination, merchantId);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getSpecificCatalogController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await getSpecificCatalogService(params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const editCatalogController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await editCatalogService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteCatalogController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await deleteCatalogService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
