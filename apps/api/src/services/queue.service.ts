import { Queue, Worker, Job } from "bullmq";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import {
  sendCoursePaymentConfirmationEmail,
  sendSubscriptionConfirmationEmail,
  sendJobApplicationEmail,
} from "../modules/notifications/notification.service";
import { checkAndGenerateCertificate } from "../modules/certificates/certificate.service";

// Connection options for BullMQ
const redisConnection = env.redisUrl
  ? { url: env.redisUrl }
  : { host: "127.0.0.1", port: 6379 };

export interface EmailJobData {
  jobType: "COURSE_PAYMENT" | "SUBSCRIPTION" | "JOB_APPLICATION";
  payload: any;
}

export interface PdfJobData {
  userId: string;
  courseId: string;
}

// ─── Queues ───────────────────────────────────────────────────────────────────
let emailQueue: Queue<EmailJobData> | null = null;
let pdfQueue: Queue<PdfJobData> | null = null;

let emailWorker: Worker<EmailJobData> | null = null;
let pdfWorker: Worker<PdfJobData> | null = null;

const isRedisAvailable = Boolean(env.redisUrl || env.nodeEnv === "production");

if (isRedisAvailable) {
  try {
    emailQueue = new Queue<EmailJobData>("email-queue", {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: true,
      },
    });

    pdfQueue = new Queue<PdfJobData>("pdf-queue", {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: "fixed",
          delay: 1000,
        },
        removeOnComplete: true,
      },
    });

    // Worker 1: Asynchronous Email Worker
    emailWorker = new Worker<EmailJobData>(
      "email-queue",
      async (job: Job<EmailJobData>) => {
        logger.info(`[Queue:Email] Processing job ${job.id} (${job.data.jobType})`);
        const { jobType, payload } = job.data;

        switch (jobType) {
          case "COURSE_PAYMENT":
            await sendCoursePaymentConfirmationEmail(
              payload.email,
              payload.userName,
              payload.amount,
              payload.txRef,
              payload.courseName,
            );
            break;
          case "SUBSCRIPTION":
            await sendSubscriptionConfirmationEmail(
              payload.email,
              payload.companyName,
              payload.amount,
              payload.plan,
            );
            break;
          case "JOB_APPLICATION":
            await sendJobApplicationEmail(
              payload.companyEmail,
              payload.jobTitle,
              payload.applicantName,
            );
            break;
          default:
            logger.warn(`[Queue:Email] Unknown job type: ${jobType}`);
        }
      },
      { connection: redisConnection },
    );

    emailWorker.on("failed", (job?: Job<EmailJobData>, err?: Error) => {
      logger.error(`[Queue:Email] Job ${job?.id} failed:`, {
        error: err?.message,
      });
    });

    // Worker 2: Asynchronous PDF / Certificate Generation Worker
    pdfWorker = new Worker<PdfJobData>(
      "pdf-queue",
      async (job: Job<PdfJobData>) => {
        logger.info(`[Queue:PDF] Generating certificate for user ${job.data.userId}`);
        await checkAndGenerateCertificate(job.data.userId, job.data.courseId);
      },
      { connection: redisConnection },
    );

    pdfWorker.on("failed", (job?: Job<PdfJobData>, err?: Error) => {
      logger.error(`[Queue:PDF] Job ${job?.id} failed:`, {
        error: err?.message,
      });
    });

    logger.info("[Queue] BullMQ workers and queues initialized successfully");
  } catch (err: any) {
    logger.warn("[Queue] BullMQ initialization skipped (falling back to direct execution):", {
      message: err.message,
    });
  }
}

// ─── Public Enqueue Helpers with Direct Fallback ──────────────────────────────

export async function enqueueEmail(data: EmailJobData) {
  if (emailQueue) {
    await emailQueue.add(`email-${Date.now()}`, data);
    logger.debug(`[Queue] Email job enqueued (${data.jobType})`);
  } else {
    // Direct sync fallback when Redis is offline or in development
    const { jobType, payload } = data;
    if (jobType === "COURSE_PAYMENT") {
      await sendCoursePaymentConfirmationEmail(
        payload.email,
        payload.userName,
        payload.amount,
        payload.txRef,
        payload.courseName,
      );
    } else if (jobType === "SUBSCRIPTION") {
      await sendSubscriptionConfirmationEmail(
        payload.email,
        payload.companyName,
        payload.amount,
        payload.plan,
      );
    } else if (jobType === "JOB_APPLICATION") {
      await sendJobApplicationEmail(
        payload.companyEmail,
        payload.jobTitle,
        payload.applicantName,
      );
    }
  }
}

export async function enqueuePdfGeneration(userId: string, courseId: string) {
  if (pdfQueue) {
    await pdfQueue.add(`pdf-${userId}-${courseId}`, { userId, courseId });
    logger.debug(`[Queue] PDF generation job enqueued for user ${userId}`);
  } else {
    await checkAndGenerateCertificate(userId, courseId);
  }
}
