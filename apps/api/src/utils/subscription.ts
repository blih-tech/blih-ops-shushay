/**
 * Canonical subscription-active check for a company profile.
 *
 * Checks the `CompanySubscription` relation first, and also supports
 * the company profile scalar flag (`subscriptionActive`) for seeded or
 * administrative override accounts.
 */
export function isCompanySubscriptionActive(company: {
  subscriptionActive?: boolean | null;
  subscriptionExpiresAt?: Date | null;
  companySubscription?: { status: string; expiresAt: Date } | null;
}): boolean {
  const sub = company.companySubscription;
  if (sub && sub.status === "ACTIVE" && sub.expiresAt > new Date()) {
    return true;
  }
  if (company.subscriptionActive) {
    if (!company.subscriptionExpiresAt || company.subscriptionExpiresAt > new Date()) {
      return true;
    }
  }
  return false;
}
