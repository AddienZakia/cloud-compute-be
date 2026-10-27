import { Router } from "express";
import {
  createCatalogController,
  deleteCatalogController,
  editCatalogController,
  getAllCatalogsController,
  getSpecificCatalogController,
} from "../controllers/catalogs.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorization } from "../middlewares/authorize.middleware";
import { uploadSingleImage } from "../middlewares/file-uploads.middleware";

const route = Router();

// Public: Siapapun dapat melihat daftar menu katalog
route.get("/", getAllCatalogsController);

// Public: Siapapun dapat melihat detail menu katalog
route.get("/:id", getSpecificCatalogController);

// Protected: Admin atau Merchant membuat menu baru
route.post(
  "/",
  authenticate,
  authorization("ADMIN", "MERCHANT"),
  uploadSingleImage("imageUrl"),
  createCatalogController,
);

// Protected: Admin atau Merchant mengedit menu
route.put(
  "/:id",
  authenticate,
  authorization("ADMIN", "MERCHANT"),
  uploadSingleImage("imageUrl"),
  editCatalogController,
);

// Protected: Admin atau Merchant menghapus menu
route.delete(
  "/:id",
  authenticate,
  authorization("ADMIN", "MERCHANT"),
  deleteCatalogController,
);

export default route;
