import type { ApplicationItem } from "../types/application";

export const mockApplications: ApplicationItem[] = [
  {
    id: "app-1",
    jobTitle: "Senior Frontend Engineer — Next.js Systems",
    companyName: "Vortex Operations Europe",
    location: "Remote (EU / UK Timezone)",
    salary: "€65,000 - €85,000 / year",
    appliedDate: "August 24, 2026",
    matchScore: 96,
    status: "INTERVIEW_SCHEDULED",
  },
  {
    id: "app-2",
    jobTitle: "Fullstack Application Engineer",
    companyName: "Omega Global Platform",
    location: "Remote (Global)",
    salary: "€60,000 - €80,000 / year",
    appliedDate: "August 20, 2026",
    matchScore: 82,
    status: "IN_REVIEW",
  },
];
