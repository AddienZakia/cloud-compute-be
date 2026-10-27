import { Router } from "express";
import {
  createMerchantController,
  deleteMerchantController,
  editMerchantController,
  getAllMerchantsController,
  getSpecificMerchantController,
} from "../controllers/merchants.controller";
import { authorization } from "../middlewares/authorize.middleware";
import { uploadSingleImage } from "../middlewares/file-uploads.middleware";

const route = Router();

route.post(
  "/",
  authorization("ADMIN"),
  uploadSingleImage("imageUrl"),
  createMerchantController,
);
route.get(
  "/",
  authorization("ADMIN", "USER", "MERCHANT", "DRIVER"),
  getAllMerchantsController,
);
route.get(
  "/:id",
  authorization("ADMIN", "USER", "MERCHANT", "DRIVER"),
  getSpecificMerchantController,
);
route.put(
  "/:id",
  authorization("ADMIN", "MERCHANT"),
  uploadSingleImage("imageUrl"),
  editMerchantController,
);
route.delete("/:id", authorization("ADMIN"), deleteMerchantController);

export default route;
