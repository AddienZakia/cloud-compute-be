import { NextFunction, Request, Response } from "express";
import {
  deleteUserService,
  editUserService,
  getAllUsersService,
  getMeService,
  getSpecificUserService,
} from "../services/users.service";
import { getIdParamsSchema } from "../validations/common.schema";
import { paginationSchema } from "../validations/pagination.schema";

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { response } = await getMeService(req.user!);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const editUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await editUserService(req);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getSpecificUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await getSpecificUserService(params.id);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const response = await getAllUsersService(pagination);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = getIdParamsSchema.parse(req.params);
    const response = await deleteUserService(params.id);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
