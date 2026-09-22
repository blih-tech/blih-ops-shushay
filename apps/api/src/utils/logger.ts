/**
 * Minimal structured logger for blih-api.
 * Uses console under the hood but respects NODE_ENV:
 *  - debug() is suppressed in production
 *  - all levels are suppressed in test
 */
const isTest = process.env.NODE_ENV === "test";
const isProd = process.env.NODE_ENV === "production";

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    if (isTest) return;
    console.log(`[INFO] ${msg}`, meta ?? "");
  },
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (isTest || isProd) return;
    console.log(`[DEBUG] ${msg}`, meta ?? "");
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    if (isTest) return;
    console.warn(`[WARN] ${msg}`, meta ?? "");
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    if (isTest) return;
    console.error(`[ERROR] ${msg}`, meta ?? "");
  },
};
