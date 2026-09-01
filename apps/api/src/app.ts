import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import prisma from "./config/prisma";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

// Swagger Documentation Endpoints
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/v1/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/v1", routes);

// 404 Handler for Unmatched Routes
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

export default app;
