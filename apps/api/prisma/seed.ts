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
