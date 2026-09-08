import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().trim().max(5000).optional().nullable(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["IN_REVIEW", "SUBMITTED"], {
    invalid_type_error: "Status must be IN_REVIEW",
  }),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

