import { z } from "zod";

export const initializeSubscriptionSchema = z.object({
  plan: z.enum(["MONTHLY", "YEARLY"], {
    message: "Invalid subscription plan selection. Must be MONTHLY or YEARLY",
  }),
});

export type InitializeSubscriptionInput = z.infer<
  typeof initializeSubscriptionSchema
>;
