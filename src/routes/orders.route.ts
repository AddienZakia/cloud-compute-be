import { Router } from "express";
import {
  createOrderController,
  deleteOrderController,
  editOrderController,
  getAllOrdersController,
  getSpecificOrderController,
  updateOrderStatusController,
} from "../controllers/orders.controller";
import { authorization } from "../middlewares/authorize.middleware";

const route = Router();

route.post("/", authorization("ADMIN", "USER"), createOrderController);
route.get(
  "/",
  authorization("ADMIN", "USER", "DRIVER", "MERCHANT"),
  getAllOrdersController,
);
route.get(
  "/:id",
  authorization("ADMIN", "USER", "DRIVER", "MERCHANT"),
  getSpecificOrderController,
);
route.patch(
  "/:id/status",
  authorization("ADMIN", "DRIVER", "MERCHANT"),
  updateOrderStatusController,
);
route.put("/:id", authorization("ADMIN"), editOrderController);
route.delete("/:id", authorization("ADMIN"), deleteOrderController);

export default route;
