import { Prisma } from "@prisma/client";

/**
 * Canonical subscription-active check for a company profile.
 *
 * Accepts the minimal shape returned by Prisma when selecting
 * `companySubscription { status, expiresAt }`.
 * Only checks the `CompanySubscription` relation — the legacy
 * `subscriptionActive` / `subscriptionExpiresAt` scalar fields on
 * `CompanyProfile` are intentionally ignored here.
 */
export function isCompanySubscriptionActive(company: {
  companySubscription: { status: string; expiresAt: Date } | null;
}): boolean {
  const sub = company.companySubscription;
  if (!sub) return false;
  return sub.expiresAt > new Date() && sub.status === "ACTIVE";
}
