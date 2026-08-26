import { z } from "zod";

export const updateCompanyProfileSchema = z.object({
  companyName: z.string().trim().min(1, "Company name cannot be empty").optional().nullable(),
  description: z.string().trim().max(1000, "Description must be at most 1000 characters").optional().nullable(),
  website: z.string().trim().url("Invalid website URL format").or(z.string().trim().length(0)).optional().nullable(),
  country: z.string().trim().min(1, "Country cannot be empty").optional().nullable(),
  city: z.string().trim().min(1, "City cannot be empty").optional().nullable(),
  contactName: z.string().trim().min(1, "Contact person name cannot be empty").optional().nullable(),
  contactEmail: z.string().trim().email("Invalid contact email format").or(z.string().trim().length(0)).optional().nullable(),
  contactPhone: z.string().trim().min(5, "Contact phone too short").max(15, "Contact phone must be at most 15 characters").optional().nullable()
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
