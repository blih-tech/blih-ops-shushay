import type { JobPosting } from "@/types/job";

export type { JobPosting };


export const mockJobs: JobPosting[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer — Next.js Systems",
    company: "Vortex Operations Europe",
    location: "Remote (EU / UK Timezone)",
    salary: "€65,000 - €85,000 / year",
    matchScore: 96,
    tags: ["Full-Time", "Remote", "React 19", "TypeScript"],
    description:
      "Join our core operations engineering group to build decoupled frontend micro-applications with high performance and accessibility standards.",
    postedDate: "2 days ago",
    requiredSkills: [
      { name: "React Systems", score: 90 },
      { name: "TypeScript Architecture", score: 85 },
      { name: "UI Accessibility", score: 80 },
    ],
  },
  {
    id: "job-2",
    title: "Product Operations & UI Specialist",
    company: "Altitude Digital Solutions",
    location: "Remote / Hybrid",
    salary: "€50,000 - €70,000 / year",
    matchScore: 88,
    tags: ["Full-Time", "Figma", "Design Systems", "Tailwind"],
    description:
      "Bridge the gap between design tokens and implementation. Collaborate directly with engineering to build evidence-backed user interfaces.",
    postedDate: "4 days ago",
    requiredSkills: [
      { name: "UI Design Systems", score: 85 },
      { name: "Component Libraries", score: 85 },
    ],
  },
  {
    id: "job-3",
    title: "Fullstack Application Engineer",
    company: "Omega Global Platform",
    location: "Remote (Global)",
    salary: "€60,000 - €80,000 / year",
    matchScore: 82,
    tags: ["Full-Time", "Node.js", "PostgreSQL", "React"],
    description:
      "Develop end-to-end features spanning Prisma ORM backend data pipelines and responsive React web experiences.",
    postedDate: "1 week ago",
    requiredSkills: [
      { name: "Node.js & Express", score: 80 },
      { name: "PostgreSQL & Prisma", score: 80 },
    ],
  },
];
