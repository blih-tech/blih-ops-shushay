import { z } from "zod";
import { EmploymentType, ExperienceLevel, EnglishLevel, JobStatus } from "@prisma/client";

export const createJobSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(5000),
  requiredSkills: z
    .array(z.string().trim().min(1))
    .min(1, "At least one required skill must be specified"),
  englishLevel: z.nativeEnum(EnglishLevel).optional().nullable(),
  salaryMin: z.number().positive().optional().nullable(),
  salaryMax: z.number().positive().optional().nullable(),
  salaryCurrency: z.string().trim().min(1).max(10).default("USD"),
  salaryDisplay: z.string().trim().max(100).optional().nullable(),
  employmentType: z.nativeEnum(EmploymentType),
  workingHours: z.string().trim().max(100).optional().nullable(),
  timezone: z.string().trim().max(100).optional().nullable(),
  countryRestrictions: z.array(z.string().trim().min(1)).default([]),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  applicationDeadline: z
    .string()
    .datetime({ message: "Invalid deadline date" })
    .optional()
    .nullable()
    .transform((v) => (v ? new Date(v) : null)),
});

export const updateJobSchema = createJobSchema.partial();

export const jobQuerySchema = z.object({
  search: z.string().trim().optional(),
  skills: z.string().trim().optional(), // comma-separated
  englishLevel: z.nativeEnum(EnglishLevel).optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  status: z.nativeEnum(JobStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
