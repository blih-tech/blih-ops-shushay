"use client";

import React from "react";
import { Badge } from "@blih/ui";

type StatusVariant = "primary" | "secondary" | "verified" | "danger" | "outline" | "success" | "warning" | "coral" | "amber" | "default" | "dark";

interface StatusConfig {
  label: string;
  variant: StatusVariant;
}

const JOB_STATUS: Record<string, StatusConfig> = {
  ACTIVE: { label: "Active", variant: "verified" },
  CLOSED: { label: "Closed", variant: "secondary" },
};

const APPLICATION_STATUS: Record<string, StatusConfig> = {
  SUBMITTED: { label: "Submitted", variant: "primary" },
  IN_REVIEW: { label: "In Review", variant: "outline" },
  INTERVIEW_SCHEDULED: { label: "Interview", variant: "verified" },
  OFFER_EXTENDED: { label: "Offer Extended", variant: "verified" },
  REJECTED: { label: "Rejected", variant: "danger" },
  WITHDRAWN: { label: "Withdrawn", variant: "secondary" },
};

const PAYMENT_STATUS: Record<string, StatusConfig> = {
  PENDING: { label: "Pending", variant: "outline" },
  SUCCESSFUL: { label: "Successful", variant: "verified" },
  FAILED: { label: "Failed", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "secondary" },
};

const SUBSCRIPTION_STATUS: Record<string, StatusConfig> = {
  ACTIVE: { label: "Active", variant: "verified" },
  EXPIRED: { label: "Expired", variant: "secondary" },
};

const COURSE_STATUS: Record<string, StatusConfig> = {
  PUBLISHED: { label: "Published", variant: "verified" },
  DRAFT: { label: "Draft", variant: "secondary" },
};

const PAYMENT_TYPE: Record<string, StatusConfig> = {
  SKILLS_ACCESS: { label: "Skills Access", variant: "primary" },
  COMPANY_SUBSCRIPTION: { label: "Subscription", variant: "outline" },
};

const USER_ROLE: Record<string, StatusConfig> = {
  ADMIN: { label: "Admin", variant: "danger" },
  TALENT: { label: "Talent", variant: "primary" },
  COMPANY: { label: "Company", variant: "verified" },
};

const SUB_PLAN: Record<string, StatusConfig> = {
  MONTHLY: { label: "Monthly", variant: "primary" },
  YEARLY: { label: "Yearly", variant: "verified" },
};

type StatusType =
  | "job"
  | "application"
  | "payment"
  | "subscription"
  | "course"
  | "paymentType"
  | "role"
  | "subPlan";

interface AdminStatusBadgeProps {
  type: StatusType;
  value: string;
  size?: "sm" | "md";
}

const STATUS_MAPS: Record<StatusType, Record<string, StatusConfig>> = {
  job: JOB_STATUS,
  application: APPLICATION_STATUS,
  payment: PAYMENT_STATUS,
  subscription: SUBSCRIPTION_STATUS,
  course: COURSE_STATUS,
  paymentType: PAYMENT_TYPE,
  role: USER_ROLE,
  subPlan: SUB_PLAN,
};

export function AdminStatusBadge({ type, value, size = "sm" }: AdminStatusBadgeProps) {
  const map = STATUS_MAPS[type];
  const config = map?.[value];

  if (!config) {
    return (
      <Badge variant="secondary" size={size}>
        {value}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
