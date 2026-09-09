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

export async function requireSkillsAccess(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }

  // Administrators automatically have access
  if (req.user.role === Role.ADMIN) {
    return next();
  }

  const entitlement = await prisma.skillsEntitlement.findUnique({
    where: { userId: req.user.id },
  });

  if (!entitlement) {
    return next(
      new AppError(
        403,
        "Skills payment required. Please purchase permanent access for 1,000 ETB to unlock course content.",
      ),
    );
  }

  next();
}

export async function requireActiveSubscription(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }

  // Administrators automatically have access
  if (req.user.role === Role.ADMIN) {
    return next();
  }

  if (req.user.role !== Role.COMPANY) {
    return next(
      new AppError(
        403,
        "Access denied. Only company accounts can access this feature.",
      ),
    );
  }

  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId: req.user.id },
    select: {
      id: true,
      subscriptionActive: true,
      subscriptionExpiresAt: true,
      companySubscription: {
        select: {
          status: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!companyProfile) {
    return next(new AppError(403, "Access denied. Company profile not found."));
  }

  const now = new Date();
  const sub = companyProfile.companySubscription;
  const isSubscribed = sub
    ? sub.expiresAt > now && sub.status === "ACTIVE"
    : Boolean(
        companyProfile.subscriptionActive &&
        companyProfile.subscriptionExpiresAt &&
        companyProfile.subscriptionExpiresAt > now,
      );

  if (!isSubscribed) {
    return next(
      new AppError(
        402,
        "Payment Required. An active company subscription (2,000 ETB/month or 10,000 ETB/year) is required to perform this action.",
      ),
    );
  }

  next();
}
