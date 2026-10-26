import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, details: err.details ?? null },
    });
  }

  // In production, only log the error message — never leak stack traces to stdout
  // or to the client response.
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    logger.error("Unhandled error", {
      message: err instanceof Error ? err.message : "Unknown error",
      path: _req.path,
      method: _req.method,
    });
  } else {
    console.error(err);
  }

  return res.status(500).json({
    error: { message: "Internal server error" },
  });
}
