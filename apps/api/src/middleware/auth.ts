import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import prisma from "../config/prisma";
import { AppError } from "./errorHandler";
import { JwtPayload } from "../types/auth.types";
import { getSetting } from "../modules/settings/settings.service";

// ─── User session cache (60-second TTL) ──────────────────────────────────────
// Prevents a DB round-trip on every authenticated request. Keyed by userId.
const userCache = new Map<string, { data: { id: string; email: string; role: Role; emailVerified: boolean }; expiresAt: number }>();
const USER_CACHE_TTL_MS = 60_000;

function getCachedUser(userId: string) {
  const entry = userCache.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    userCache.delete(userId);
    return null;
  }
  return entry.data;
}

function setCachedUser(userId: string, data: { id: string; email: string; role: Role; emailVerified: boolean }) {
  userCache.set(userId, { data, expiresAt: Date.now() + USER_CACHE_TTL_MS });
}

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

    // Check cache first to avoid DB hit on every request
    const cached = getCachedUser(decoded.userId);
    if (cached) {
      req.user = cached;
      return next();
    }

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

    setCachedUser(user.id, user);
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
        "Skills payment required. Please purchase permanent access to unlock course content.",
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
  const isSubscribed =
    sub != null && sub.expiresAt > now && sub.status === "ACTIVE";

  if (!isSubscribed) {
      const subMonthly = await getSetting("PRICE_SUBSCRIPTION_MONTHLY", "2000");
      const subYearly = await getSetting("PRICE_SUBSCRIPTION_YEARLY", "10000");
      return next(
        new AppError(
          402,
          `Payment Required. An active company subscription (${Number(subMonthly).toLocaleString()} ETB/month or ${Number(subYearly).toLocaleString()} ETB/year) is required to perform this action.`,
        ),
      );
  }

  next();
}


