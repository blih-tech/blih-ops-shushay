/**
 * WARNING: DO NOT RUN THIS IN PRODUCTION.
 * This is a destructive script meant only for local development testing.
 */
// Dev-only script: reset skills payment state so you can re-test the payment flow.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const entitlements = await prisma.skillsEntitlement.deleteMany();
  console.log("✅ Entitlements deleted:", entitlements.count);

  const payments = await prisma.paymentTransaction.updateMany({
    where: { status: "SUCCESSFUL" },
    data: { status: "FAILED" },
  });
  console.log("✅ Successful payment records reset to FAILED:", payments.count);

  await prisma.$disconnect();
  await pool.end();
  console.log("Done — you can now test the payment flow from scratch.");
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
