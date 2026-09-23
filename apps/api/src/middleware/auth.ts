import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import prisma from "../config/prisma";
import { AppError } from "./errorHandler";
import { JwtPayload } from "../types/auth.types";
import { getSetting } from "../modules/settings/settings.service";
import { redisClient } from "../config/redis";

// ─── Cached user shape ────────────────────────────────────────────────────────
interface CachedUserData {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
}

// ─── In-process LRU (fallback when Redis is unavailable) ─────────────────────
// Bounded to 1 000 entries; TTL is enforced on read.
class LRUCache {
  private max: number;
  private cache: Map<string, { data: CachedUserData; expiresAt: number }>;

  constructor(max = 1000) {
    this.max = max;
    this.cache = new Map();
  }

  get(key: string): CachedUserData | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) { this.cache.delete(key); return null; }
    // Move to tail (LRU promotion)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.data;
  }

  set(key: string, data: CachedUserData, ttlMs: number) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.max) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  delete(key: string) { this.cache.delete(key); }
}

const lruFallback = new LRUCache(1000);
const USER_CACHE_TTL_S = 60; // seconds (used by Redis SETEX)
const USER_CACHE_TTL_MS = USER_CACHE_TTL_S * 1000;
const CACHE_KEY = (userId: string) => `auth:user:${userId}`;

// ─── Cache helpers (Redis → LRU fallback) ────────────────────────────────────

async function getCachedUser(userId: string): Promise<CachedUserData | null> {
  const key = CACHE_KEY(userId);
  if (redisClient && redisClient.status === "ready") {
    try {
      const raw = await redisClient.get(key);
      return raw ? (JSON.parse(raw) as CachedUserData) : null;
    } catch {
      // Redis error — fall through to LRU
    }
  }
  return lruFallback.get(key);
}

async function setCachedUser(userId: string, data: CachedUserData): Promise<void> {
  const key = CACHE_KEY(userId);
  if (redisClient && redisClient.status === "ready") {
    try {
      await redisClient.setex(key, USER_CACHE_TTL_S, JSON.stringify(data));
      return;
    } catch {
      // Redis error — fall through to LRU
    }
  }
  lruFallback.set(key, data, USER_CACHE_TTL_MS);
}

export async function invalidateCachedUser(userId: string): Promise<void> {
  const key = CACHE_KEY(userId);
  if (redisClient && redisClient.status === "ready") {
    try { await redisClient.del(key); } catch { /* ignore */ }
  }
  lruFallback.delete(key);
}

// ─── Middleware ───────────────────────────────────────────────────────────────

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
    const cached = await getCachedUser(decoded.userId);
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

    await setCachedUser(user.id, user);
    req.user = user;
    next();
  } catch {
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

/**
 * Per-course enrollment check.
 * Reads courseId from req.params.courseId.
 * Administrators bypass the check automatically.
 */
export async function requireCourseEnrollment(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }

  // Administrators automatically have access to all courses
  if (req.user.role === Role.ADMIN) {
    return next();
  }

  const courseId = req.params.courseId as string | undefined;
  if (!courseId) {
    return next(
      new AppError(400, "Course ID is required to verify enrollment."),
    );
  }

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId: req.user.id, courseId } },
  });

  if (!enrollment) {
    return next(
      new AppError(
        403,
        "Course enrollment required. Please purchase access to this course.",
      ),
    );
  }

  next();
}

/**
 * @deprecated Use requireCourseEnrollment instead.
 * Kept as an alias so existing imports compile during the migration.
 */
export const requireSkillsAccess = requireCourseEnrollment;

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


