/**
 * Job Expiration Scheduler
 *
 * Runs periodically to transition active jobs past their application deadline
 * to CLOSED status in the database.
 * Uses BullMQ if Redis is available, and falls back to an in-memory interval.
 */

import { Queue, Worker, Job } from "bullmq";
import { JobStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

const JOB_SCHEDULER_QUEUE = "job-scheduler";
const EXPIRE_JOB_NAME = "expire-jobs";
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // Run every 1 hour

const redisConnection = env.redisUrl
  ? { url: env.redisUrl }
  : { host: "127.0.0.1", port: 6379 };

let jobQueue: Queue | null = null;
let jobWorker: Worker | null = null;
let fallbackInterval: NodeJS.Timeout | null = null;

/**
 * Core handler: find and close jobs where status is ACTIVE and applicationDeadline < now
 */
export async function closeExpiredJobs(): Promise<number> {
  const now = new Date();
  try {
    const result = await prisma.job.updateMany({
      where: {
        status: JobStatus.ACTIVE,
        applicationDeadline: {
          lt: now,
        },
      },
      data: {
        status: JobStatus.CLOSED,
      },
    });

    if (result.count > 0) {
      logger.info(
        `[JobScheduler] Closed ${result.count} expired job(s) past deadline.`,
      );
    }
    return result.count;
  } catch (err: any) {
    logger.error("[JobScheduler] Error updating expired jobs:", {
      error: err?.message,
    });
    return 0;
  }
}

export function initJobScheduler(): void {
  const isRedisAvailable = Boolean(env.redisUrl || env.nodeEnv === "production");

  if (!isRedisAvailable) {
    logger.info(
      "[JobScheduler] Redis not available — starting in-process interval fallback (1h)",
    );
    // Run an initial sweep
    closeExpiredJobs().catch(() => {});
    fallbackInterval = setInterval(() => {
      closeExpiredJobs().catch(() => {});
    }, CHECK_INTERVAL_MS);
    if (fallbackInterval.unref) {
      fallbackInterval.unref();
    }
    return;
  }

  try {
    jobQueue = new Queue(JOB_SCHEDULER_QUEUE, {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: 5,
        removeOnFail: 10,
        attempts: 2,
      },
    });

    jobQueue.add(
      EXPIRE_JOB_NAME,
      {},
      {
        repeat: { every: CHECK_INTERVAL_MS },
        jobId: `${EXPIRE_JOB_NAME}-repeatable`,
      },
    );

    jobWorker = new Worker(
      JOB_SCHEDULER_QUEUE,
      async (_job: Job) => {
        await closeExpiredJobs();
      },
      { connection: redisConnection, concurrency: 1 },
    );

    jobWorker.on("failed", (job?: Job, err?: Error) => {
      logger.error(`[JobScheduler] Job ${job?.id} failed`, {
        error: err?.message,
      });
    });

    logger.info("[JobScheduler] Initialized — checks every 1 hour via BullMQ");
  } catch (err: any) {
    logger.error("[JobScheduler] Failed to initialize BullMQ worker", {
      message: err?.message,
    });
    // Fall back to interval
    fallbackInterval = setInterval(() => {
      closeExpiredJobs().catch(() => {});
    }, CHECK_INTERVAL_MS);
    if (fallbackInterval.unref) {
      fallbackInterval.unref();
    }
  }
}

export async function gracefulShutdownJobScheduler(): Promise<void> {
  if (fallbackInterval) {
    clearInterval(fallbackInterval);
  }
  await jobWorker?.close();
  await jobQueue?.close();
}
