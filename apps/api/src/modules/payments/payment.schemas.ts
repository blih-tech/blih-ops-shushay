import { z } from "zod";

export const verifyPaymentSchema = z.object({
  txRef: z.string().trim().min(1, "Transaction reference is required"),
});

/**
 * Payment initialization schema.
 * callbackUrl and returnUrl are intentionally not accepted from clients —
 * all URLs are derived from server env vars to prevent open-redirect attacks.
 */
export const initializeSkillsPaymentSchema = z.object({});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type InitializeSkillsPaymentInput = z.infer<typeof initializeSkillsPaymentSchema>;

