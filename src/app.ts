import "dotenv/config";
import cors from "cors";
import express, { Express } from "express";
import path from "path";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import router from "./routes";

const app: Express = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory
app.use("/public", express.static(path.join(process.cwd(), "public")));

// CORS Configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Main API v1 routing
app.use("/api/v1", router);

// Error and 404 handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
