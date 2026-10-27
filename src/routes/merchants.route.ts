import { Router } from "express";
import {
  createMerchantController,
  deleteMerchantController,
  editMerchantController,
  getAllMerchantsController,
  getMerchantStatsController,
  getSpecificMerchantController,
} from "../controllers/merchants.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorization } from "../middlewares/authorize.middleware";
import { uploadSingleImage } from "../middlewares/file-uploads.middleware";

const route = Router();

// Public: Siapapun (termasuk tamu / belum login) dapat melihat daftar merchant
route.get("/", getAllMerchantsController);

// Protected: Ringkasan statistik operasional mitra
route.get(
  "/stats",
  authenticate,
  authorization("ADMIN", "MERCHANT"),
  getMerchantStatsController,
);

// Public: Siapapun dapat melihat detail profil merchant
route.get("/:id", getSpecificMerchantController);

// Protected: Admin membuat merchant baru
route.post(
  "/",
  authenticate,
  authorization("ADMIN"),
  uploadSingleImage("imageUrl"),
  createMerchantController,
);

// Protected: Admin atau Merchant mengedit profilnya
route.put(
  "/:id",
  authenticate,
  authorization("ADMIN", "MERCHANT"),
  uploadSingleImage("imageUrl"),
  editMerchantController,
);

// Protected: Admin menghapus merchant
route.delete(
  "/:id",
  authenticate,
  authorization("ADMIN"),
  deleteMerchantController,
);

export default route;
