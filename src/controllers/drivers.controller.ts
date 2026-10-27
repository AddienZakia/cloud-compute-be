import { NextFunction, Request, Response } from "express";
import {
  createDriverService,
  deleteDriverService,
  editDriverService,
  getAllDriversService,
  getDriverStatsService,
  getSpecificDriverService,
} from "../services/drivers.service";
import { getIdParamsSchema } from "../validations/common.schema";
import { paginationSchema } from "../validations/pagination.schema";

export const createDriverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await createDriverService(req);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllDriversController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const response = await getAllDriversService(pagination);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getSpecificDriverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await getSpecificDriverService(params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const editDriverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await editDriverService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteDriverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await deleteDriverService(params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getDriverStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getDriverStatsService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
