/**
 * Redis-backed webhook idempotency middleware.
 *
 * Purpose: Prevent Chapa (or any caller) from triggering a duplicate payment
 * completion when the same webhook is delivered more than once.
 *
 * Strategy:
 *  1. Derive a fingerprint from the `tx_ref` in the body (falling back to a
 *     SHA-256 hash of the raw body when tx_ref is unavailable).
 *  2. Attempt an atomic SET NX (set-if-not-exists) with a 24-hour TTL in Redis.
 *  3. If the key already exists → respond 200 immediately (idempotent replay).
 *  4. If Redis is unavailable → fall through to the real handler (fail-open).
 */

import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

const IDEMPOTENCY_TTL_S = 60 * 60 * 24; // 24 hours
const KEY_PREFIX = "webhook:idempotency:";

/**
 * Derives a stable fingerprint for the incoming webhook request.
 * Prefers tx_ref (human-readable, stable) over a raw-body hash.
 */
function deriveFingerprint(req: Request): string {
  const txRef = (req.body?.tx_ref || req.body?.txRef) as string | undefined;

  if (txRef && txRef.length > 0) {
    return `txref:${txRef}`;
  }

  // Fallback: SHA-256 of the raw body bytes (populated by the JSON verify
  // hook in app.ts when the request hits /api/v1/payments/webhook).
  const raw: Buffer | undefined = (req as any).rawBody;
  if (raw && raw.length > 0) {
    return `body:${createHash("sha256").update(raw).digest("hex")}`;
  }

  // Last resort: SHA-256 of the stringified body (less reliable, but better
  // than nothing when rawBody is absent in test environments).
  return `body:${createHash("sha256").update(JSON.stringify(req.body ?? {})).digest("hex")}`;
}

/**
 * Express middleware that enforces idempotency on the Chapa webhook endpoint.
 * Mount this **before** the handler:
 *
 *   router.post("/webhook", webhookIdempotency, chapaWebhook);
 */
export async function webhookIdempotency(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!redisClient) {
    // Redis unavailable — fail-open to avoid blocking legitimate webhooks.
    logger.warn(
      "[Idempotency] Redis not available — skipping idempotency check for webhook",
    );
    next();
    return;
  }

  let fingerprint: string;
  try {
    fingerprint = deriveFingerprint(req);
  } catch (err) {
    logger.error("[Idempotency] Failed to derive fingerprint", { err });
    next();
    return;
  }

  const redisKey = `${KEY_PREFIX}${fingerprint}`;

  try {
    // Atomic SET NX EX — returns "OK" on first call, null on replay
    const result = await redisClient.set(redisKey, "1", "EX", IDEMPOTENCY_TTL_S, "NX");

    if (result === null) {
      // Key existed — this is a duplicate delivery
      logger.info(`[Idempotency] Duplicate webhook detected — key=${redisKey}`);
      res.status(200).json({
        status: "ok",
        message: "Duplicate webhook — already processed",
        idempotent: true,
      });
      return;
    }

    // First time seen — let the real handler run
    logger.debug(`[Idempotency] New webhook fingerprint registered — key=${redisKey}`);
    next();
  } catch (err: any) {
    // Redis error — fail-open (log and continue)
    logger.error("[Idempotency] Redis error during idempotency check", {
      message: err?.message,
      key: redisKey,
    });
    next();
  }
}
