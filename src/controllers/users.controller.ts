import { NextFunction, Request, Response } from "express";
import {
  createUserService,
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
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await createUserService(req);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const editUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await editUserService(req);
    return res.status(200).json(response);
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
    return res.status(200).json(response);
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
    return res.status(200).json(response);
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
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
