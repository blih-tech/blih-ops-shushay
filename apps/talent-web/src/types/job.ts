export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

export type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";

export type JobStatus = "ACTIVE" | "CLOSED";

export type EnglishLevel =
  | "BASIC"
  | "CONVERSATIONAL"
  | "PROFESSIONAL"
  | "FLUENT"
  | "NATIVE";

export interface CompanyInfo {
  companyName: string;
  logoUrl?: string | null;
  description?: string | null;
  website?: string | null;
  country?: string | null;
  city?: string | null;
}

export interface Job {
  id: string;
  companyProfileId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  englishLevel?: EnglishLevel | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  salaryDisplay?: string | null;
  employmentType: EmploymentType;
  workingHours?: string | null;
  timezone?: string | null;
  countryRestrictions: string[];
  experienceLevel: ExperienceLevel;
  applicationDeadline?: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  companyProfile?: CompanyInfo;
  _count?: {
    applications: number;
  };
  hasApplied?: boolean;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  requiredSkills: string[];
  englishLevel?: EnglishLevel | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  salaryDisplay?: string | null;
  employmentType: EmploymentType;
  workingHours?: string | null;
  timezone?: string | null;
  countryRestrictions?: string[];
  experienceLevel: ExperienceLevel;
  applicationDeadline?: string | null;
}

export type UpdateJobPayload = Partial<CreateJobPayload>;

export interface JobFilters {
  search?: string;
  skills?: string;
  englishLevel?: EnglishLevel;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export interface JobsListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Legacy/Mock Compatibility Interfaces ───────────────────────────────────

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore?: number;
  tags?: string[];
  description: string;
  postedDate: string;
  requiredSkills?: { name: string; score: number }[] | string[];
  employmentType?: string;
  experienceLevel?: string;
  englishLevel?: string | null;
}

export interface CompanyJobItem {
  id: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  salary?: string;
  applicantsCount?: number;
  status: "ACTIVE" | "PAUSED" | "CLOSED";
  postedDate: string;
  requiredSkills?: string[];
}
