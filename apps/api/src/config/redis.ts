import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

// ─── Redis Client (graceful fallback) ────────────────────────────────────────
// If REDIS_URL is not set, the module exports null and auth.ts falls back
// to the in-process LRU cache automatically.

let redisClient: Redis | null = null;

if (env.redisUrl) {
  redisClient = new Redis(env.redisUrl, {
    // Never crash the process on connection failure — just log and fall back.
    enableOfflineQueue: false,
    lazyConnect: false,
    retryStrategy: (times) => {
      // Exponential back-off capped at 30 s
      const delay = Math.min(1000 * 2 ** times, 30_000);
      return delay;
    },
  });

  redisClient.on("connect", () => {
    logger.info("[Redis] Connected");
  });

  redisClient.on("error", (err) => {
    logger.error("[Redis] Connection error — falling back to in-process LRU cache", { message: err.message });
    // Don't crash; the auth middleware checks `redisClient` before using it.
  });
}

export { redisClient };
