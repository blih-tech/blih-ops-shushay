import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import prisma from "./config/prisma";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import { requireAuth } from "./middleware/auth";
import routes from "./routes";

const app = express();

// Strict CSP for all routes; relaxed only for the Swagger UI documentation path
app.use((req, res, next) => {
  if (req.path.startsWith("/api/docs")) {
    // Swagger UI needs inline styles/scripts and its own CDN
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
        },
      },
    })(req, res, next);
  } else {
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      },
    })(req, res, next);
  }
});
app.use(cors({ origin: env.corsOrigins, credentials: true }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Global: 200 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});
// Strict: 20 requests per 15 minutes for auth endpoints (prevents brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please wait and try again." },
});

app.use("/api/v1", globalLimiter);
app.use("/api/v1/auth", authLimiter);
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

// Canonical Swagger documentation endpoint
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
