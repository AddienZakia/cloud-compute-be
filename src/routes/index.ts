import { Router } from "express";
import { healthController } from "../controllers/health.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import authRouter from "./auth.route";
import catalogsRouter from "./catalogs.route";
import driversRouter from "./drivers.route";
import merchantsRouter from "./merchants.route";
import ordersRouter from "./orders.route";
import transactionsRouter from "./transactions.route";
import uploadRouter from "./upload.route";
import usersRouter from "./users.route";

const router = Router();

// Health check endpoint
router.get("/health", healthController);

// Auth routes (public)
router.use("/auth", authRouter);

// Protected routes (require JWT authentication)
// Upload routes (Azure Blob Storage)
router.use("/upload", uploadRouter);

// User routes (protected with JWT authentication)
router.use("/users", authenticate, usersRouter);
router.use("/drivers", authenticate, driversRouter);
router.use("/merchants", merchantsRouter);
router.use("/catalogs", catalogsRouter);
router.use("/orders", authenticate, ordersRouter);
router.use("/transactions", authenticate, transactionsRouter);

export default router;
