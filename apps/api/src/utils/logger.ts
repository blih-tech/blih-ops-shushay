/**
 * Structured logger for blih-api.
 * - In production: outputs JSON lines with ISO timestamp, level, message, and structured metadata
 * - In development: outputs formatted console logs
 * - In test: suppressed unless LOG_TEST=true
 */
const isTest = process.env.NODE_ENV === "test" && !process.env.LOG_TEST;
const isProd = process.env.NODE_ENV === "production";

type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (isTest) return;
  if (level === "debug" && isProd) return;

  const timestamp = new Date().toISOString();

  if (isProd) {
    const entry = JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(meta || {}),
    });
    if (level === "error") {
      process.stderr.write(entry + "\n");
    } else {
      process.stdout.write(entry + "\n");
    }
  } else {
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const consoleFn =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : console.log;

    if (meta && Object.keys(meta).length > 0) {
      consoleFn(`${prefix} ${message}`, meta);
    } else {
      consoleFn(`${prefix} ${message}`);
    }
  }
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => log("debug", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta),
};

