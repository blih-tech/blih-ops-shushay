import type { ApplicationStatus } from "@blih/types";
export type { ApplicationStatus };


export interface ApplicationItem {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  appliedDate: string;
  matchScore: number;
  status: ApplicationStatus;
}
