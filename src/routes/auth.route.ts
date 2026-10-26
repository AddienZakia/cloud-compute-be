import { Router } from "express";
import {
  loginController,
  loginDriverController,
  loginMerchantController,
  registerController,
} from "../controllers/auth.controller";

const route = Router();

route.post("/register", registerController);
route.post("/login", loginController);
route.post("/login/driver", loginDriverController);
route.post("/login/merchant", loginMerchantController);

export default route;
