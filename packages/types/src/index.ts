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
  metadata?: Record<string, any> | null;
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

export interface Notification {
  id: string;
  userId: string;
  type: string;
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


