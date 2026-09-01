import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import prisma from "../config/prisma";
import { AppError } from "./errorHandler";
import { JwtPayload } from "../types/auth.types";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError(401, "Authentication token required"));
    }

    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return next(new AppError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireRole(allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(
        `[requireRole FAILED] User: ${req.user.email}, Role: ${req.user.role}, Allowed: ${allowedRoles}`,
      );
      return next(
        new AppError(403, "Access denied. Insufficient permissions."),
      );
    }

    next();
  };
}
