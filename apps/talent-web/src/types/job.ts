export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  tags: string[];
  description: string;
  postedDate: string;
  requiredSkills: { name: string; score: number }[];
}

export interface CompanyJobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  applicantsCount: number;
  status: "ACTIVE" | "PAUSED" | "CLOSED";
  postedDate: string;
  requiredSkills: string[];
}
