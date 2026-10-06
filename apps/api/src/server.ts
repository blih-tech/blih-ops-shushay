import app from "./app";
import { env } from "./config/env";
import {
  initSubscriptionScheduler,
  gracefulShutdownScheduler,
} from "./modules/company-subscriptions/subscription.scheduler";
import {
  initJobScheduler,
  gracefulShutdownJobScheduler,
} from "./modules/jobs/job.scheduler";
import { sseNotificationManager } from "./modules/notifications/sse.service";

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});

const port = Number(env.port) || 4000;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 blih-api listening on 0.0.0.0:${port}`);
  // Start the subscription renewal reminder scheduler (every 6 hours)
  initSubscriptionScheduler();
  // Start the job deadline expiration cleaner (every 1 hour)
  initJobScheduler();
});

// Graceful shutdown: drain BullMQ workers and close connections before exiting
async function shutdown(signal: string) {
  console.log(`\n[Server] Received ${signal} — shutting down gracefully...`);
  await Promise.allSettled([
    gracefulShutdownScheduler(),
    gracefulShutdownJobScheduler(),
    sseNotificationManager.close(),
  ]);
  server.close(() => {
    console.log("[Server] HTTP server closed.");
    process.exit(0);
  });
  // Force-exit after 15s if still not closed
  setTimeout(() => process.exit(1), 15_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
