export type Role = "TALENT" | "COMPANY" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified?: boolean;
}

export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "CANCELLED";
export type PaymentType = "SKILLS_ACCESS" | "COMPANY_SUBSCRIPTION";

export interface PaymentTransaction {
  id: string;
  userId: string;
  txRef: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  status: PaymentStatus;
  chapaRef?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsEntitlement {
  id: string;
  userId: string;
  paymentId?: string | null;
  grantedAt: string;
  updatedAt: string;
}

export interface SkillsAccessStatus {
  hasAccess: boolean;
  grantedAt?: string | null;
  payment?: {
    txRef: string;
    amount: number;
    currency: string;
    createdAt: string;
  } | null;
}

export type NotificationType =
  | "NEW_JOB_APPLICATION"
  | "SKILLS_PAYMENT_SUCCESS"
  | "COMPANY_SUBSCRIPTION_SUCCESS"
  | "CERTIFICATE_EARNED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type SubscriptionPlan = "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED";

export interface CompanySubscription {
  id: string;
  companyProfileId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  startDate: string;
  expiresAt: string;
  paymentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySubscriptionStatusResponse {
  hasActiveSubscription: boolean;
  subscription: CompanySubscription | null;
  expiresAt: string | null;
  daysRemaining: number;
}

export type ApplicationStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "OFFER_EXTENDED"
  | "REJECTED"
  | "WITHDRAWN";

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

