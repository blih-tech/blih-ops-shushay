import app from "./app";
import { env } from "./config/env";

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});

const server = app.listen(env.port, () => {
  console.log(`🚀 blih-api listening on port ${env.port}`);
});
