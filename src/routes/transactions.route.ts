import { Router } from "express";
import {
  getAllTransactionsController,
  getSpecificTransactionController,
  updateTransactionStatusController,
} from "../controllers/transactions.controller";
import { authorization } from "../middlewares/authorize.middleware";

const route = Router();

route.get(
  "/",
  authorization("ADMIN", "USER", "MERCHANT"),
  getAllTransactionsController,
);
route.get(
  "/:id",
  authorization("ADMIN", "USER", "MERCHANT"),
  getSpecificTransactionController,
);
route.patch(
  "/:id/status",
  authorization("ADMIN", "USER"),
  updateTransactionStatusController,
);

export default route;
