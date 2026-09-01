import type { CompanyJobItem } from "@/types/job";

export type { CompanyJobItem };


export const mockCompanyJobs: CompanyJobItem[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer — Design Systems",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-Time",
    salary: "$65,000 - $85,000 / year",
    applicantsCount: 12,
    status: "ACTIVE",
    postedDate: "3 days ago",
    requiredSkills: ["React 19", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "job-2",
    title: "Fullstack Application Developer",
    department: "Product Group",
    location: "Addis Ababa / Hybrid",
    type: "Full-Time",
    salary: "$50,000 - $70,000 / year",
    applicantsCount: 8,
    status: "ACTIVE",
    postedDate: "1 week ago",
    requiredSkills: ["Node.js", "PostgreSQL", "Prisma", "React"],
  },
  {
    id: "job-3",
    title: "Product UI/UX Designer",
    department: "Design",
    location: "Remote (Europe / Africa)",
    type: "Contract",
    salary: "$45,000 - $60,000 / year",
    applicantsCount: 5,
    status: "ACTIVE",
    postedDate: "2 weeks ago",
    requiredSkills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
  },
];
