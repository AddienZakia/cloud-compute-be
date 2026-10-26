import { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  deleteOrderService,
  editOrderService,
  getAllOrdersService,
  getSpecificOrderService,
  updateOrderStatusService,
} from "../services/orders.service";
import { getIdParamsSchema } from "../validations/common.schema";
import { paginationSchema } from "../validations/pagination.schema";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await createOrderService(req);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const response = await getAllOrdersService(req, pagination);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getSpecificOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await getSpecificOrderService(req, params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await updateOrderStatusService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const editOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await editOrderService(req);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await deleteOrderService(params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
