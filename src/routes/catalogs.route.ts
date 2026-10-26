import { Router } from "express";
import {
  createCatalogController,
  deleteCatalogController,
  editCatalogController,
  getAllCatalogsController,
  getSpecificCatalogController,
} from "../controllers/catalogs.controller";
import { authorization } from "../middlewares/authorize.middleware";

const route = Router();

route.post("/", authorization("ADMIN", "MERCHANT"), createCatalogController);
route.get(
  "/",
  authorization("ADMIN", "USER", "MERCHANT", "DRIVER"),
  getAllCatalogsController,
);
route.get(
  "/:id",
  authorization("ADMIN", "USER", "MERCHANT", "DRIVER"),
  getSpecificCatalogController,
);
route.put("/:id", authorization("ADMIN", "MERCHANT"), editCatalogController);
route.delete(
  "/:id",
  authorization("ADMIN", "MERCHANT"),
  deleteCatalogController,
);

export default route;
