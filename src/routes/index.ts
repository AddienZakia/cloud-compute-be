import { Router } from "express";
import { healthController } from "../controllers/health.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import authRouter from "./auth.route";
import catalogsRouter from "./catalogs.route";
import driversRouter from "./drivers.route";
import merchantsRouter from "./merchants.route";
import ordersRouter from "./orders.route";
import transactionsRouter from "./transactions.route";
import usersRouter from "./users.route";

const router = Router();

// Health check endpoint
router.get("/health", healthController);

// Auth routes (public)
router.use("/auth", authRouter);

// Protected routes (require JWT authentication)
router.use("/users", authenticate, usersRouter);
router.use("/drivers", authenticate, driversRouter);
router.use("/merchants", authenticate, merchantsRouter);
router.use("/catalogs", authenticate, catalogsRouter);
router.use("/orders", authenticate, ordersRouter);
router.use("/transactions", authenticate, transactionsRouter);

export default router;
