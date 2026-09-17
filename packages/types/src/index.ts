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

export interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  employmentType: string;
  experienceLevel: string;
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  companyProfileId: string;
}

export interface TalentProfile {
  id: string;
  userId: string;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  skills: string[];
  bio?: string | null;
  photoUrl?: string | null;
  cvUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  talentProfileId: string;
  status: ApplicationStatus;
  coverLetter?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  talentProfile?: TalentProfile;
}
