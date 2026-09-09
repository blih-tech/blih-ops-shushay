export const COMPANY_SUBSCRIPTION_PLANS = {
  MONTHLY: {
    price: 2000,
    currency: "ETB",
    months: 1,
    title: "Company Monthly Subscription",
    description:
      "1-month full access to candidate directory, contact details, and job postings.",
  },
  YEARLY: {
    price: 10000,
    currency: "ETB",
    months: 12,
    title: "Company Yearly Subscription",
    description:
      "12-month full unmetered access to candidate directory, contact details, and job postings.",
  },
} as const;

export type SubscriptionPlanKey = keyof typeof COMPANY_SUBSCRIPTION_PLANS;
