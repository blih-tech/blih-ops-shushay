import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().trim().max(5000).optional().nullable(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
