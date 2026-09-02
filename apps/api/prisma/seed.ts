import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new pg.Pool({ connectionString });
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

  // 3. Seed Company User
  const company = await prisma.user.upsert({
    where: { email: "company@blih.com" },
    update: {
      passwordHash: defaultPasswordHash,
      emailVerified: true,
    },
    create: {
      email: "company@blih.com",
      passwordHash: defaultPasswordHash,
      role: "COMPANY",
      emailVerified: true,
    },
  });
  console.log(`👤 Company user: ${company.email}`);

  // 4. Seed Course 1: React Product Systems
  const course1 = await prisma.course.create({
    data: {
      title: "React Product Systems & Architecture",
      description: "Learn to design and build production-ready React interfaces through component architecture, state management, accessibility, and real product work.",
      status: "PUBLISHED",
      lessons: {
        create: [
          {
            title: "Chapter 1: Component Architecture & Interface Systems",
            content: "Welcome to React Product Systems! In this chapter, we explore scalable component structures, composition patterns, and design system tokens.",
            order: 1,
          },
          {
            title: "Chapter 2: Global State Management & API Integration",
            content: "Learn how to manage application state with custom hooks, async data fetching, error boundaries, and optimistic updates.",
            order: 2,
          },
          {
            title: "Chapter 3: Accessibility States & Form Validation",
            content: "Build accessible forms using semantic HTML, ARIA landmarks, keyboard focus rings, and real-time schema validation.",
            order: 3,
          },
        ],
      },
    },
  });
  console.log(`📚 Seeded published course: ${course1.title}`);

  // 5. Seed Course 2: Python Fundamentals
  const course2 = await prisma.course.create({
    data: {
      title: "Python Fundamentals for Product Operations",
      description: "Master core Python programming, data structures, automation scripts, and backend data processing pipelines.",
      status: "PUBLISHED",
      lessons: {
        create: [
          {
            title: "Module 1: Python Syntax & Data Types",
            content: "Get started with Python numbers, strings, lists, dictionaries, functions, and standard library tools.",
            order: 1,
          },
          {
            title: "Module 2: Automation & File Processing Pipelines",
            content: "Learn to write automated scripts for reading CSV files, processing JSON data, and building CLI tools.",
            order: 2,
          },
          {
            title: "Module 3: REST API Services & Integration",
            content: "Understand HTTP requests, API endpoint routing, middleware authorization, and database integrations.",
            order: 3,
          },
        ],
      },
    },
  });
  console.log(`📚 Seeded published course: ${course2.title}`);

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
