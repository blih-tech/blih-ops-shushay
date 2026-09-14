import type { TalentProfileCard } from "@/types/talent-card";

export type { TalentProfileCard };

export const mockTalents: TalentProfileCard[] = [
  {
    id: "tal-1",
    name: "Mikeal Tadesse",
    title: "Senior Frontend Systems Engineer",
    location: "Addis Ababa, Ethiopia",
    englishLevel: "Fluent",
    skills: [
      "React 19",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Design Systems",
    ],
    bio: "Specializing in decoupled frontend architectures, high-performance web applications, and accessible design system implementations.",
    experienceYears: "5+ years",
    verifiedScore: 96,
  },
  {
    id: "tal-2",
    name: "Yonas Bekele",
    title: "Fullstack Application Engineer",
    location: "Addis Ababa, Ethiopia",
    englishLevel: "Professional",
    skills: ["Node.js", "PostgreSQL", "Prisma", "Express", "React"],
    bio: "Fullstack engineer experienced in building robust REST/GraphQL APIs, relational database schemas, and responsive dashboards.",
    experienceYears: "4 years",
    verifiedScore: 91,
  },
  {
    id: "tal-3",
    name: "Bethlehem Haile",
    title: "UI/UX & Product Design Engineer",
    location: "Hawassa, Ethiopia",
    englishLevel: "Fluent",
    skills: ["UI/UX Design", "Figma", "Design Tokens", "React", "Frontend"],
    bio: "Product designer and frontend builder focused on seamless candidate journeys, responsive interactions, and sleek dark/light design tokens.",
    experienceYears: "3 years",
    verifiedScore: 89,
  },
  {
    id: "tal-4",
    name: "Dawit Alemayehu",
    title: "Backend & Systems Architect",
    location: "Addis Ababa, Ethiopia",
    englishLevel: "Conversational",
    skills: ["Node.js", "PostgreSQL", "Docker", "Redis", "TypeScript"],
    bio: "Architecting scalable cloud microservices, payment transaction pipelines, and resilient async queue processing systems.",
    experienceYears: "6 years",
    verifiedScore: 94,
  },
];
