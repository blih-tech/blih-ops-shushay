import app from "./app";
import { env } from "./config/env";
import {
  initSubscriptionScheduler,
  gracefulShutdownScheduler,
} from "./modules/company-subscriptions/subscription.scheduler";

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});

const server = app.listen(env.port, () => {
  console.log(`🚀 blih-api listening on port ${env.port}`);
  // Start the subscription renewal reminder scheduler (every 6 hours)
  initSubscriptionScheduler();
});

// Graceful shutdown: drain BullMQ workers before exiting
async function shutdown(signal: string) {
  console.log(`\n[Server] Received ${signal} — shutting down gracefully...`);
  await gracefulShutdownScheduler();
  server.close(() => {
    console.log("[Server] HTTP server closed.");
    process.exit(0);
  });
  // Force-exit after 15s if still not closed
  setTimeout(() => process.exit(1), 15_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
