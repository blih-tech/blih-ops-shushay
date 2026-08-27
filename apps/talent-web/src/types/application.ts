export type ApplicationStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "OFFER_EXTENDED";

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
