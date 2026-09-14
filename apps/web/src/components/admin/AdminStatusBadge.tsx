"use client";

import React from "react";
import { Badge } from "@blih/ui";

type BadgeType =
  | "role"
  | "subscription"
  | "subPlan"
  | "payment"
  | "paymentType"
  | "job"
  | "application";

interface AdminStatusBadgeProps {
  type: BadgeType;
  value: string;
  size?: "sm" | "md";
}

const BADGE_CONFIGS: Record<
  BadgeType,
  Record<string, { label: string; variant: "success" | "warning" | "danger" | "primary" | "secondary" }>
> = {
  role: {
    ADMIN: { label: "Admin", variant: "danger" },
    COMPANY: { label: "Company", variant: "primary" },
    TALENT: { label: "Talent", variant: "secondary" },
  },
  subscription: {
    ACTIVE: { label: "Active", variant: "success" },
    EXPIRED: { label: "Expired", variant: "danger" },
    CANCELLED: { label: "Cancelled", variant: "warning" },
  },
  subPlan: {
    MONTHLY: { label: "Monthly", variant: "primary" },
    ANNUAL: { label: "Annual", variant: "success" },
    ENTERPRISE: { label: "Enterprise", variant: "secondary" },
  },
  payment: {
    SUCCESSFUL: { label: "Successful", variant: "success" },
    PENDING: { label: "Pending", variant: "warning" },
    FAILED: { label: "Failed", variant: "danger" },
    CANCELLED: { label: "Cancelled", variant: "secondary" },
  },
  paymentType: {
    SKILLS_ACCESS: { label: "Skills Access", variant: "primary" },
    COMPANY_SUBSCRIPTION: { label: "Subscription", variant: "secondary" },
  },
  job: {
    ACTIVE: { label: "Active", variant: "success" },
    CLOSED: { label: "Closed", variant: "secondary" },
    DRAFT: { label: "Draft", variant: "warning" },
  },
  application: {
    SUBMITTED: { label: "Submitted", variant: "primary" },
    IN_REVIEW: { label: "In Review", variant: "warning" },
    INTERVIEW_SCHEDULED: { label: "Interview Scheduled", variant: "primary" },
    OFFER_EXTENDED: { label: "Offer Extended", variant: "success" },
    REJECTED: { label: "Rejected", variant: "danger" },
    WITHDRAWN: { label: "Withdrawn", variant: "secondary" },
  },
};

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  type,
  value,
  size = "sm",
}) => {
  const config = BADGE_CONFIGS[type]?.[value];

  if (!config) {
    const formatted = value
      ? value
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : value;

    return (
      <Badge variant="secondary" size={size}>
        {formatted}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};
