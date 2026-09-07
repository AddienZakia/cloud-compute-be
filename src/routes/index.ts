import { Router } from "express";
import { healthController } from "../controllers/health.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import authRouter from "./auth.route";
import usersRouter from "./users.route";

const router = Router();

// Health check endpoint
router.get("/health", healthController);

// Auth routes (public)
router.use("/auth", authRouter);

// User routes (protected with JWT authentication)
router.use("/users", authenticate, usersRouter);

export default router;
