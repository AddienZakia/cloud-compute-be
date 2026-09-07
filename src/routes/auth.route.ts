import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  sendVerifyTokenController,
  verifyEmailController,
} from "../controllers/auth.controller";

const route = Router();

route.post("/login", loginController);
route.post("/register", registerController);
route.post("/verify-email", verifyEmailController);
// route.post('/refresh-token', verifyEmailController)
route.post("/reset-password", resetPasswordController);
route.post("/forgot-password", forgotPasswordController);
route.post("/send-verify-token", sendVerifyTokenController); // (Verify token registration) - check jika date now < expires time

export default route;
