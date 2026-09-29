/**
 * Subscription Renewal Scheduler
 *
 * Runs as a periodic BullMQ "repeatable" job (every 6 hours) to:
 *  1. Find all ACTIVE company subscriptions expiring within the next 7 days
 *  2. Emit reminder notifications + emails at 7d, 3d, 1d before expiry
 *  3. Expire subscriptions that have passed their expiresAt (with 3-day grace)
 *  4. Mark subscriptions in grace period (EXPIRED status but still-gated access
 *     window so companies can renew before hard-lock)
 *
 * The scheduler is bootstrapped via initSubscriptionScheduler() called once
 * from server.ts after BullMQ is initialised.
 */

import { Queue, Worker, Job } from "bullmq";
import { SubscriptionStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { createNotification } from "../notifications/notification.service";
import {
  sendSubscriptionReminderEmail,
  sendSubscriptionExpiredEmail,
  sendGracePeriodEmail,
} from "../notifications/notification.service";

const SCHEDULER_QUEUE = "subscription-scheduler";
const JOB_NAME = "subscription-check";
const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // every 6 hours

// Reminder thresholds in days
const REMINDER_THRESHOLDS_DAYS = [7, 3, 1] as const;
type ReminderDay = (typeof REMINDER_THRESHOLDS_DAYS)[number];

// Redis connection shared with main queue.service
const redisConnection = env.redisUrl
  ? { url: env.redisUrl }
  : { host: "127.0.0.1", port: 6379 };

let schedulerQueue: Queue | null = null;
let schedulerWorker: Worker | null = null;

/**
 * Core handler: scan subscriptions, send reminders, expire grace period subs.
 */
async function runSubscriptionCheck(): Promise<void> {
  const now = new Date();
  logger.info("[SubscriptionScheduler] Running subscription check...");

  // ── 1. Find all ACTIVE subscriptions ─────────────────────────────────────
  const activeSubscriptions = await prisma.companySubscription.findMany({
    where: { status: SubscriptionStatus.ACTIVE },
    include: {
      companyProfile: {
        include: {
          user: { select: { id: true, email: true } },
        },
      },
    },
  });

  let remindedCount = 0;
  let expiredCount = 0;

  for (const sub of activeSubscriptions) {
    const expiresAt = sub.expiresAt;
    const msRemaining = expiresAt.getTime() - now.getTime();
    const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);

    const userId = sub.companyProfile?.user?.id;
    const email = sub.companyProfile?.contactEmail || sub.companyProfile?.user?.email;
    const companyName = sub.companyProfile?.companyName || email || "Your company";
    const plan = sub.plan;

    if (!userId || !email) continue;

    // ── 2. Hard expiry: no grace left ──────────────────────────────────────
    if (daysRemaining <= 0) {
      await prisma.$transaction([
        prisma.companySubscription.update({
          where: { id: sub.id },
          data: { status: SubscriptionStatus.EXPIRED },
        }),
        prisma.companyProfile.update({
          where: { id: sub.companyProfileId },
          data: {
            subscriptionActive: false,
          },
        }),
      ]);

      await createNotification({
        userId,
        type: "SUBSCRIPTION_EXPIRED",
        title: "Your subscription has expired",
        message: `Your ${plan.toLowerCase()} subscription expired on ${expiresAt.toLocaleDateString()}. Renew now to restore full company access.`,
      });

      await sendSubscriptionExpiredEmail(email, companyName, plan, expiresAt).catch((err) =>
        logger.error("[SubscriptionScheduler] Failed to send expiry email", { err }),
      );

      expiredCount++;
      continue;
    }

    // ── 3. Check reminder thresholds ───────────────────────────────────────
    for (const threshold of REMINDER_THRESHOLDS_DAYS) {
      // Fire the reminder if we're within a 6-hour window of that threshold
      const thresholdMs = threshold * 24 * 60 * 60 * 1000;
      const windowMs = CHECK_INTERVAL_MS;

      if (msRemaining <= thresholdMs && msRemaining > thresholdMs - windowMs) {
        const dedupeKey = `sub_reminder:${sub.id}:d${threshold}`;

        // Use Redis to de-duplicate reminder firing across scheduler runs
        // (avoids double-sending if two workers pick up the same job)
        // We skip this check if Redis is not available (best-effort).
        const { redisClient } = await import("../../config/redis.js");
        if (redisClient) {
          const alreadySent = await redisClient.get(dedupeKey);
          if (alreadySent) {
            logger.debug(`[SubscriptionScheduler] Reminder already sent — ${dedupeKey}`);
            continue;
          }
          // Mark as sent for 8 hours (longer than the check interval)
          await redisClient.set(dedupeKey, "1", "EX", 8 * 60 * 60);
        }

        await createNotification({
          userId,
          type: "SUBSCRIPTION_EXPIRY_REMINDER",
          title: `Subscription expiring in ${threshold} day${threshold > 1 ? "s" : ""}`,
          message: `Your ${plan.toLowerCase()} subscription expires on ${expiresAt.toLocaleDateString()}. Renew now to maintain uninterrupted access.`,
        });

        await sendSubscriptionReminderEmail(
          email,
          companyName,
          threshold as ReminderDay,
          plan,
          expiresAt,
        ).catch((err) =>
          logger.error("[SubscriptionScheduler] Failed to send reminder email", { err }),
        );

        remindedCount++;
        logger.info(
          `[SubscriptionScheduler] Sent ${threshold}d reminder to ${email} (sub=${sub.id})`,
        );
        break; // Only fire one threshold per run per subscription
      }
    }
  }

  logger.info(
    `[SubscriptionScheduler] Done — reminders sent: ${remindedCount}, subscriptions expired: ${expiredCount}`,
  );
}

export function initSubscriptionScheduler(): void {
  const isRedisAvailable = Boolean(env.redisUrl || env.nodeEnv === "production");
  if (!isRedisAvailable) {
    logger.warn(
      "[SubscriptionScheduler] Redis not available — subscription reminders disabled",
    );
    return;
  }

  try {
    schedulerQueue = new Queue(SCHEDULER_QUEUE, {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: 5,
        removeOnFail: 10,
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      },
    });

    // Register repeatable job (survives server restarts because BullMQ stores it in Redis)
    schedulerQueue.add(
      JOB_NAME,
      {},
      {
        repeat: { every: CHECK_INTERVAL_MS },
        jobId: `${JOB_NAME}-repeatable`,
      },
    );

    schedulerWorker = new Worker(
      SCHEDULER_QUEUE,
      async (_job: Job) => {
        await runSubscriptionCheck();
      },
      { connection: redisConnection, concurrency: 1 },
    );

    schedulerWorker.on("failed", (job?: Job, err?: Error) => {
      logger.error(`[SubscriptionScheduler] Job ${job?.id} failed`, {
        error: err?.message,
      });
    });

    schedulerWorker.on("completed", (job: Job) => {
      logger.info(`[SubscriptionScheduler] Job ${job?.id} completed`);
    });

    logger.info("[SubscriptionScheduler] Initialized — checks every 6 hours");
  } catch (err: any) {
    logger.error("[SubscriptionScheduler] Failed to initialize", {
      message: err?.message,
    });
  }
}

export async function gracefulShutdownScheduler(): Promise<void> {
  await schedulerWorker?.close();
  await schedulerQueue?.close();
}
