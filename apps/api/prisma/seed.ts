import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 1. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@blih.com" },
    update: {
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      emailVerified: true,
    },
    create: {
      email: "admin@blih.com",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      emailVerified: true,
    },
  });
  console.log(`👤 Admin user: ${admin.email}`);

  // 2. Seed Talent User
  const talent = await prisma.user.upsert({
    where: { email: "talent@blih.com" },
    update: {
      passwordHash: defaultPasswordHash,
      role: "TALENT",
      emailVerified: true,
    },
    create: {
      email: "talent@blih.com",
      passwordHash: defaultPasswordHash,
      role: "TALENT",
      emailVerified: true,
    },
  });
  console.log(`👤 Talent user: ${talent.email}`);

  // 2b. Seed Talent Profile
  await prisma.talentProfile.upsert({
    where: { userId: talent.id },
    update: {
      fullName: "Abebe Bikila",
      title: "Full Stack Software Engineer",
      country: "Ethiopia",
      city: "Addis Ababa",
      englishLevel: "FLUENT",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Python"],
      bio: "Passionate engineer with 4+ years building scalable web services, design systems, and cloud backend solutions.",
    },
    create: {
      userId: talent.id,
      fullName: "Abebe Bikila",
      title: "Full Stack Software Engineer",
      country: "Ethiopia",
      city: "Addis Ababa",
      englishLevel: "FLUENT",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Python"],
      bio: "Passionate engineer with 4+ years building scalable web services, design systems, and cloud backend solutions.",
    },
  });

  // 3. Seed Company User & Profile
  const company = await prisma.user.upsert({
    where: { email: "company@blih.com" },
    update: {
      passwordHash: defaultPasswordHash,
      role: "COMPANY",
      emailVerified: true,
    },
    create: {
      email: "company@blih.com",
      passwordHash: defaultPasswordHash,
      role: "COMPANY",
      emailVerified: true,
    },
  });

  const companyProfile = await prisma.companyProfile.upsert({
    where: { userId: company.id },
    update: {
      companyName: "TechCorp Global",
      description: "Building next-generation product engineering and design infrastructure.",
      website: "https://techcorp.example.com",
      country: "Ethiopia",
      city: "Addis Ababa",
      contactName: "Sarah Jenkins",
      contactEmail: "company@blih.com",
      subscriptionActive: true,
    },
    create: {
      userId: company.id,
      companyName: "TechCorp Global",
      description: "Building next-generation product engineering and design infrastructure.",
      website: "https://techcorp.example.com",
      country: "Ethiopia",
      city: "Addis Ababa",
      contactName: "Sarah Jenkins",
      contactEmail: "company@blih.com",
      subscriptionActive: true,
    },
  });
  console.log(`👤 Company user: ${company.email} (${companyProfile.companyName})`);

  // 4. Seed Mock Jobs
  const mockJobs = [
    {
      title: "Senior Full Stack Engineer (React & Node.js)",
      description:
        "We are looking for a Senior Full Stack Engineer to build and scale our high-throughput customer web application and GraphQL/REST microservices.",
      requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
      englishLevel: "FLUENT" as const,
      salaryMin: 3500,
      salaryMax: 5000,
      salaryCurrency: "USD",
      employmentType: "FULL_TIME" as const,
      experienceLevel: "SENIOR" as const,
      workingHours: "Full Time (40 hrs/week)",
      timezone: "GMT+3 / Remote",
      countryRestrictions: [],
      status: "ACTIVE" as const,
    },
    {
      title: "UI/UX & Design Systems Product Designer",
      description:
        "Join our design team to build accessible, high-performance web and mobile UI component systems and conduct end-to-end user research.",
      requiredSkills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "User Research"],
      englishLevel: "PROFESSIONAL" as const,
      salaryMin: 2500,
      salaryMax: 3800,
      salaryCurrency: "USD",
      employmentType: "FULL_TIME" as const,
      experienceLevel: "MID" as const,
      workingHours: "Full Time (40 hrs/week)",
      timezone: "Remote",
      countryRestrictions: [],
      status: "ACTIVE" as const,
    },
    {
      title: "DevOps & Cloud Systems Engineer",
      description:
        "Lead infrastructure automation, CI/CD pipeline optimization, Kubernetes deployment strategy, and site reliability monitoring.",
      requiredSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
      englishLevel: "FLUENT" as const,
      salaryMin: 4000,
      salaryMax: 6000,
      salaryCurrency: "USD",
      employmentType: "CONTRACT" as const,
      experienceLevel: "SENIOR" as const,
      workingHours: "Contract (30 hrs/week)",
      timezone: "Remote",
      countryRestrictions: [],
      status: "ACTIVE" as const,
    },
    {
      title: "Junior Frontend Developer (React & Next.js)",
      description:
        "Great opportunity for early-career developers looking to build modern web interfaces with Next.js, Tailwind CSS, and state management.",
      requiredSkills: ["React", "JavaScript", "HTML/CSS", "Git"],
      englishLevel: "CONVERSATIONAL" as const,
      salaryMin: 1200,
      salaryMax: 1800,
      salaryCurrency: "USD",
      employmentType: "FULL_TIME" as const,
      experienceLevel: "ENTRY" as const,
      workingHours: "Full Time",
      timezone: "Remote",
      countryRestrictions: [],
      status: "ACTIVE" as const,
    },
  ];

  for (const jobData of mockJobs) {
    const existingJob = await prisma.job.findFirst({
      where: {
        companyProfileId: companyProfile.id,
        title: jobData.title,
      },
    });

    if (!existingJob) {
      await prisma.job.create({
        data: {
          companyProfileId: companyProfile.id,
          ...jobData,
        },
      });
      console.log(`💼 Seeded job: ${jobData.title}`);
    }
  }

  // 5. Seed Mock Courses
  const mockCourses = [
    {
      title: "React Product Systems & Architecture",
      description:
        "Learn to design and build production-ready React interfaces through component architecture, state management, accessibility, and real product work.",
      price: 1000,
      status: "PUBLISHED" as const,
      lessons: [
        {
          title: "Chapter 1: Component Architecture & Interface Systems",
          content:
            "Welcome to React Product Systems! In this chapter, we explore scalable component structures, composition patterns, and design system tokens.",
          order: 1,
        },
        {
          title: "Chapter 2: Global State Management & API Integration",
          content:
            "Learn how to manage application state with custom hooks, async data fetching, error boundaries, and optimistic updates.",
          order: 2,
        },
        {
          title: "Chapter 3: Accessibility States & Form Validation",
          content:
            "Build accessible forms using semantic HTML, ARIA landmarks, keyboard focus rings, and real-time schema validation.",
          order: 3,
        },
      ],
    },
    {
      title: "Python Fundamentals for Product Operations",
      description:
        "Master core Python programming, data structures, automation scripts, and backend data processing pipelines.",
      price: 1000,
      status: "PUBLISHED" as const,
      lessons: [
        {
          title: "Module 1: Python Syntax & Data Types",
          content:
            "Get started with Python numbers, strings, lists, dictionaries, functions, and standard library tools.",
          order: 1,
        },
        {
          title: "Module 2: Automation & File Processing Pipelines",
          content:
            "Learn to write automated scripts for reading CSV files, processing JSON data, and building CLI tools.",
          order: 2,
        },
        {
          title: "Module 3: REST API Services & Integration",
          content:
            "Understand HTTP requests, API endpoint routing, middleware authorization, and database integrations.",
          order: 3,
        },
      ],
    },
    {
      title: "Full-Stack Web Development with Next.js & Node.js",
      description:
        "Master full-stack web applications with modern Next.js App Router, Express API services, PostgreSQL database integration, and deployment.",
      price: 1500,
      status: "PUBLISHED" as const,
      lessons: [
        {
          title: "Lesson 1: Introduction to Next.js App Router",
          content:
            "Understand server components, client components, file-based routing, and layout nesting in Next.js.",
          order: 1,
        },
        {
          title: "Lesson 2: RESTful API Design & Express Controllers",
          content:
            "Architect robust REST endpoints, validation schemas, JWT authentication, and error handling middleware.",
          order: 2,
        },
        {
          title: "Lesson 3: Database ORM with Prisma & PostgreSQL",
          content:
            "Model relations, write raw SQL queries, manage database migrations, and handle connection pooling.",
          order: 3,
        },
      ],
    },
    {
      title: "UI/UX Design Systems & Micro-Interactions",
      description:
        "Learn component architecture, accessibility guidelines, animations, prototyping, and token systems using Figma and Vanilla CSS.",
      price: 1200,
      status: "PUBLISHED" as const,
      lessons: [
        {
          title: "Lesson 1: Principles of Modern Design Tokens",
          content:
            "Define color palettes, typography scales, spacing grids, and elevation shadows for cohesive digital products.",
          order: 1,
        },
        {
          title: "Lesson 2: Interactive Prototyping & Motion",
          content:
            "Add keyframe animations, transition curves, hover states, and dynamic visual feedback to user flows.",
          order: 2,
        },
      ],
    },
  ];

  for (const courseData of mockCourses) {
    let course = await prisma.course.findFirst({
      where: { title: courseData.title },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          status: courseData.status,
          lessons: {
            create: courseData.lessons,
          },
        },
      });
      console.log(`📚 Seeded published course: ${course.title}`);
    }
  }

  console.log("✅ Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
