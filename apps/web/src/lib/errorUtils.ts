import { getErrorMessage } from "@blih/api-client";

export { getErrorMessage };

/**
 * Normalizes any error type into a user-friendly string message.
 */
export function formatApiError(
  err: unknown,
  fallbackMessage = "An unexpected error occurred"
): string {
  const msg = getErrorMessage(err);
  return msg && msg !== "Unknown error" ? msg : fallbackMessage;
}
