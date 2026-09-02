import { z } from "zod";

export const verifyPaymentSchema = z.object({
  txRef: z.string().trim().min(1, "Transaction reference is required"),
});

export const initializeSkillsPaymentSchema = z.object({
  callbackUrl: z.string().url("Invalid callback URL").optional(),
  returnUrl: z.string().url("Invalid return URL").optional(),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type InitializeSkillsPaymentInput = z.infer<typeof initializeSkillsPaymentSchema>;
