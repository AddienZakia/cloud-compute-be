import { Router } from "express";
import {
  createDriverController,
  deleteDriverController,
  editDriverController,
  getAllDriversController,
  getDriverStatsController,
  getSpecificDriverController,
} from "../controllers/drivers.controller";
import { authorization } from "../middlewares/authorize.middleware";

const route = Router();

route.post("/", authorization("ADMIN"), createDriverController);
route.get("/", authorization("ADMIN"), getAllDriversController);
route.get("/stats", authorization("ADMIN", "DRIVER"), getDriverStatsController);
route.get(
  "/:id",
  authorization("ADMIN", "DRIVER"),
  getSpecificDriverController,
);
route.put("/:id", authorization("ADMIN", "DRIVER"), editDriverController);
route.delete("/:id", authorization("ADMIN"), deleteDriverController);

export default route;
