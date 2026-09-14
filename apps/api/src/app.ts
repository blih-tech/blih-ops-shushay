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
import { requireAuth } from "./middleware/auth";
import routes from "./routes";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(cookieParser());
app.use(
  express.json({
    verify: (req, _res, buffer) => {
      const expressRequest = req as typeof req & {
        originalUrl?: string;
        rawBody?: Buffer;
      };
      if (expressRequest.originalUrl === "/api/v1/payments/webhook") {
        expressRequest.rawBody = Buffer.from(buffer);
      }
    },
  }),
);
app.use("/uploads/media", express.static("uploads/media"));
app.use("/uploads/private", requireAuth, express.static("uploads/private"));
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
  } catch (error) {
    console.error("[health] Database check failed", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
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
