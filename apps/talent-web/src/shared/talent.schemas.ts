import { z } from "zod";
export const EnglishLevelEnum = z.enum(["BASIC", "CONVERSATIONAL", "PROFESSIONAL", "FLUENT", "NATIVE"] as const, {
  message: "Invalid English level value"
});

export const updateTalentProfileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name cannot be empty").optional().nullable(),
  title: z.string().trim().min(1, "Title cannot be empty").max(100, "Title must be at most 100 characters").optional().nullable(),
  phone: z.string().trim().min(5, "Phone number too short").max(15, "Phone number must be at most 15 characters").optional().nullable(),
  country: z.string().trim().min(1, "Country cannot be empty").optional().nullable(),
  city: z.string().trim().min(1, "City cannot be empty").optional().nullable(),
  englishLevel: EnglishLevelEnum.optional().nullable(),
  skills: z.array(z.string().trim().min(1, "Skill cannot be empty")).optional(),
  bio: z.string().trim().max(500, "Bio must be at most 500 characters").optional().nullable()
});

export const createExperienceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  company: z.string().trim().min(1, "Company is required").max(100, "Company must be at most 100 characters"),
  startDate: z.string().datetime({ message: "Invalid startDate ISO string" }),
  endDate: z.string().datetime({ message: "Invalid endDate ISO string" }).optional().nullable(),
  current: z.boolean().optional().default(false),
  description: z.string().trim().max(1000, "Description must be at most 1000 characters").optional().nullable()
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const createEducationSchemaRaw = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(100, "Institution must be at most 100 characters"),
  degree: z.string().trim().min(1, "Degree is required").max(100, "Degree must be at most 100 characters"),
  field: z.string().trim().max(100, "Field of study must be at most 100 characters").optional().nullable(),
  startYear: z.number().int().min(1900).max(new Date().getFullYear() + 10),
  endYear: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional().nullable()
});

export const createEducationSchema = createEducationSchemaRaw.refine(data => !data.endYear || data.endYear >= data.startYear, {
  message: "End year must be greater than or equal to start year",
  path: ["endYear"]
});

export const updateEducationSchema = createEducationSchemaRaw.partial().refine(data => !data.endYear || !data.startYear || data.endYear >= data.startYear, {
  message: "End year must be greater than or equal to start year",
  path: ["endYear"]
});

export type UpdateTalentProfileInput = z.infer<typeof updateTalentProfileSchema>;
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
