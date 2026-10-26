import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  editUserController,
  getAllUsersController,
  getMeController,
  getSpecificUserController,
} from "../controllers/users.controller";
import { authorization } from "../middlewares/authorize.middleware";

const route = Router();

// Current authenticated user profile
route.get("/me", authorization("USER", "ADMIN"), getMeController);
route.put("/me", authorization("USER", "ADMIN"), editUserController);

// User administration (CRUD)
route.post("/", authorization("ADMIN"), createUserController);
route.get("/", authorization("ADMIN"), getAllUsersController);
route.get("/:id", authorization("ADMIN"), getSpecificUserController);
route.put("/:id", authorization("ADMIN"), editUserController);
route.delete("/:id", authorization("ADMIN"), deleteUserController);

export default route;
