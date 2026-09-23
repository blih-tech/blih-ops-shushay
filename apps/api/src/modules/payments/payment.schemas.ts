import { z } from "zod";

export const verifyPaymentSchema = z.object({
  txRef: z.string().trim().min(1, "Transaction reference is required"),
});

/**
 * Course payment initialization schema.
 * courseId is the course to enroll in.
 * callbackUrl and returnUrl are intentionally not accepted from clients —
 * all URLs are derived from server env vars to prevent open-redirect attacks.
 */
export const initializeCoursePaymentSchema = z.object({
  courseId: z.string().trim().min(1, "Course ID is required"),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type InitializeCoursePaymentInput = z.infer<
  typeof initializeCoursePaymentSchema
>;
