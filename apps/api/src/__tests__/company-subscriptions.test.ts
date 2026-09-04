/**
 * Integration tests for Phase 7: Company Subscriptions.
 */
import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role, SubscriptionStatus } from "@prisma/client";
import { chapaService } from "../modules/payments/chapa.service";

function makeToken(role: Role, id: string, email = "company@blih.com") {
  return jwt.sign({ userId: id, email, role }, env.jwtSecret, {
    expiresIn: "1h",
  });
}

function authCookie(id: string, role: Role) {
  return ["token=" + makeToken(role, id)];
}

jest.setTimeout(30000);

describe("Phase 7 Company Subscriptions System", () => {
  const companyUserId = "test-company-sub-user-id";
  const secondCompanyUserId = "test-company-sub-user-2-id";
  const talentUserId = "test-talent-user-for-sub-id";
  const adminUserId = "test-admin-user-for-sub-id";

  let companyProfileId: string;
  let secondCompanyProfileId: string;

  beforeAll(async () => {
    // Cleanup previous test data
    await prisma.companySubscription.deleteMany({
      where: {
        companyProfile: {
          userId: { in: [companyUserId, secondCompanyUserId] },
        },
      },
    });
    await prisma.paymentTransaction.deleteMany({
      where: { userId: { in: [companyUserId, secondCompanyUserId, talentUserId, adminUserId] } },
    });
    await prisma.companyProfile.deleteMany({
      where: { userId: { in: [companyUserId, secondCompanyUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [companyUserId, secondCompanyUserId, talentUserId, adminUserId] } },
    });

    // Create Company User 1
    const user1 = await prisma.user.create({
      data: {
        id: companyUserId,
        email: "company1@blih.com",
        passwordHash: "dummy",
        role: Role.COMPANY,
        emailVerified: true,
        companyProfile: {
          create: {
            companyName: "Acme Corp",
            contactName: "Alice Admin",
            contactEmail: "alice@acme.com",
          },
        },
      },
      include: { companyProfile: true },
    });
    companyProfileId = user1.companyProfile!.id;

    // Create Company User 2
    const user2 = await prisma.user.create({
      data: {
        id: secondCompanyUserId,
        email: "company2@blih.com",
        passwordHash: "dummy",
        role: Role.COMPANY,
        emailVerified: true,
        companyProfile: {
          create: {
            companyName: "Beta Corp",
            contactName: "Bob Boss",
            contactEmail: "bob@beta.com",
          },
        },
      },
      include: { companyProfile: true },
    });
    secondCompanyProfileId = user2.companyProfile!.id;

    // Create Talent User
    await prisma.user.create({
      data: {
        id: talentUserId,
        email: "talent-sub@blih.com",
        passwordHash: "dummy",
        role: Role.TALENT,
        emailVerified: true,
      },
    });

    // Create Admin User
    await prisma.user.create({
      data: {
        id: adminUserId,
        email: "admin-sub@blih.com",
        passwordHash: "dummy",
        role: Role.ADMIN,
        emailVerified: true,
      },
    });
  });

  afterAll(async () => {
    await prisma.companySubscription.deleteMany({
      where: {
        companyProfile: {
          userId: { in: [companyUserId, secondCompanyUserId] },
        },
      },
    });
    await prisma.paymentTransaction.deleteMany({
      where: { userId: { in: [companyUserId, secondCompanyUserId, talentUserId, adminUserId] } },
    });
    await prisma.companyProfile.deleteMany({
      where: { userId: { in: [companyUserId, secondCompanyUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [companyUserId, secondCompanyUserId, talentUserId, adminUserId] } },
    });
    await prisma.$disconnect();
  });

  describe("1. Subscription Checkout Initialization & Role Security", () => {
    it("should reject subscription initialization for TALENT role (403 Forbidden)", async () => {
      const res = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(talentUserId, Role.TALENT))
        .send({ plan: "MONTHLY" });

      expect(res.status).toBe(403);
    });

    it("should reject initialization with invalid plan key (400 Bad Request)", async () => {
      const res = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY))
        .send({ plan: "WEEKLY" });

      expect(res.status).toBe(400);
    });

    it("should initialize 2,000 ETB MONTHLY subscription checkout successfully", async () => {
      const res = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY))
        .send({ plan: "MONTHLY" });

      expect(res.status).toBe(200);
      expect(res.body.checkoutUrl).toBeDefined();
      expect(res.body.txRef).toMatch(/^blih_sub_monthly_/);

      const dbTx = await prisma.paymentTransaction.findUnique({
        where: { txRef: res.body.txRef },
      });
      expect(dbTx?.amount).toBe(2000);
      expect(dbTx?.currency).toBe("ETB");
      expect(dbTx?.paymentType).toBe("COMPANY_SUBSCRIPTION");
      expect(dbTx?.status).toBe("PENDING");
    });

    it("should initialize 10,000 ETB YEARLY subscription checkout successfully", async () => {
      const res = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(secondCompanyUserId, Role.COMPANY))
        .send({ plan: "YEARLY" });

      expect(res.status).toBe(200);
      expect(res.body.checkoutUrl).toBeDefined();
      expect(res.body.txRef).toMatch(/^blih_sub_yearly_/);

      const dbTx = await prisma.paymentTransaction.findUnique({
        where: { txRef: res.body.txRef },
      });
      expect(dbTx?.amount).toBe(10000);
      expect(dbTx?.currency).toBe("ETB");
      expect(dbTx?.paymentType).toBe("COMPANY_SUBSCRIPTION");
      expect(dbTx?.status).toBe("PENDING");
    });
  });

  describe("2. Server-Side Verification & Entitlement Activation", () => {
    let monthlyTxRef: string;

    beforeEach(async () => {
      const initRes = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY))
        .send({ plan: "MONTHLY" });
      monthlyTxRef = initRes.body.txRef;
    });

    it("should reject verification if payment amount is insufficient", async () => {
      const spy = jest.spyOn(chapaService, "verifyPayment").mockResolvedValueOnce({
        txRef: monthlyTxRef,
        amount: 500, // Expected 2000
        currency: "ETB",
        status: "success",
      });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${monthlyTxRef}`)
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/Paid amount \(500 ETB\) is less than required \(2000 ETB\)/i);

      spy.mockRestore();
    });

    it("should verify payment successfully, create CompanySubscription, and sync CompanyProfile cache", async () => {
      const spy = jest.spyOn(chapaService, "verifyPayment").mockResolvedValueOnce({
        txRef: monthlyTxRef,
        amount: 2000,
        currency: "ETB",
        status: "success",
        chapaRef: "CHAPA-SUB-REF-100",
      });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${monthlyTxRef}`)
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);
      expect(res.body.subscription).toBeDefined();
      expect(res.body.subscription.plan).toBe("MONTHLY");
      expect(res.body.subscription.status).toBe("ACTIVE");

      spy.mockRestore();

      // Check CompanyProfile cache fields updated
      const updatedProfile = await prisma.companyProfile.findUnique({
        where: { id: companyProfileId },
      });
      expect(updatedProfile?.subscriptionActive).toBe(true);
      expect(updatedProfile?.subscriptionExpiresAt).toBeDefined();
    });

    it("should process duplicate verification requests idempotently", async () => {
      // First verification call
      const spy = jest.spyOn(chapaService, "verifyPayment").mockResolvedValueOnce({
        txRef: monthlyTxRef,
        amount: 2000,
        currency: "ETB",
        status: "success",
      });

      await request(app)
        .get(`/api/v1/payments/verify/${monthlyTxRef}`)
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      spy.mockRestore();

      // Second verification call (duplicate / retry)
      const duplicateRes = await request(app)
        .get(`/api/v1/payments/verify/${monthlyTxRef}`)
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      expect(duplicateRes.status).toBe(200);
      expect(duplicateRes.body.verified).toBe(true);
      expect(duplicateRes.body.message).toMatch(/already successfully verified/i);

      // Verify only 1 CompanySubscription record exists
      const subsCount = await prisma.companySubscription.count({
        where: { companyProfileId },
      });
      expect(subsCount).toBe(1);
    });
  });

  describe("3. Status Endpoint & Dynamic Expiry Handling", () => {
    it("should return active subscription status correctly", async () => {
      const res = await request(app)
        .get("/api/v1/company/subscription/status")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      expect(res.status).toBe(200);
      expect(res.body.hasActiveSubscription).toBe(true);
      expect(res.body.daysRemaining).toBeGreaterThan(0);
      expect(res.body.subscription.plan).toBe("MONTHLY");
    });

    it("should dynamically detect expired subscription and update status to EXPIRED", async () => {
      // Manually set expiresAt into the past
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      await prisma.companySubscription.update({
        where: { companyProfileId },
        data: {
          expiresAt: pastDate,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      const res = await request(app)
        .get("/api/v1/company/subscription/status")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      expect(res.status).toBe(200);
      expect(res.body.hasActiveSubscription).toBe(false);
      expect(res.body.daysRemaining).toBe(0);
      expect(res.body.subscription.status).toBe("EXPIRED");

      // Verify profile cache was synchronized
      const updatedProfile = await prisma.companyProfile.findUnique({
        where: { id: companyProfileId },
      });
      expect(updatedProfile?.subscriptionActive).toBe(false);
    });
  });

  describe("4. Manual Renewal Logic", () => {
    it("should calculate renewal start date from now if currently expired", async () => {
      // Ensure current status is expired
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await prisma.companySubscription.update({
        where: { companyProfileId },
        data: { expiresAt: pastDate, status: SubscriptionStatus.EXPIRED },
      });

      // Initialize renewal
      const initRes = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY))
        .send({ plan: "MONTHLY" });

      const txRef = initRes.body.txRef;

      // Verify renewal payment
      const spy = jest.spyOn(chapaService, "verifyPayment").mockResolvedValueOnce({
        txRef,
        amount: 2000,
        currency: "ETB",
        status: "success",
      });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${txRef}`)
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);

      const updatedSub = await prisma.companySubscription.findUnique({
        where: { companyProfileId },
      });

      // Expiry should be ~30 days into the future from now
      expect(new Date(updatedSub!.expiresAt).getTime()).toBeGreaterThan(Date.now());
      expect(updatedSub?.status).toBe("ACTIVE");

      spy.mockRestore();
    });

    it("should extend existing expiresAt if renewed BEFORE current expiry", async () => {
      // Set expiresAt to 10 days in the future
      const futureBase = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      await prisma.companySubscription.update({
        where: { companyProfileId },
        data: { expiresAt: futureBase, status: SubscriptionStatus.ACTIVE },
      });

      // Initialize renewal (Monthly = +1 month)
      const initRes = await request(app)
        .post("/api/v1/company/subscription/initialize")
        .set("Cookie", authCookie(companyUserId, Role.COMPANY))
        .send({ plan: "MONTHLY" });

      const txRef = initRes.body.txRef;

      const spy = jest.spyOn(chapaService, "verifyPayment").mockResolvedValueOnce({
        txRef,
        amount: 2000,
        currency: "ETB",
        status: "success",
      });

      await request(app)
        .get(`/api/v1/payments/verify/${txRef}`)
        .set("Cookie", authCookie(companyUserId, Role.COMPANY));

      const updatedSub = await prisma.companySubscription.findUnique({
        where: { companyProfileId },
      });

      // Expiry should be futureBase + 1 month
      const expectedTarget = new Date(futureBase);
      expectedTarget.setMonth(expectedTarget.getMonth() + 1);

      expect(new Date(updatedSub!.expiresAt).toDateString()).toBe(expectedTarget.toDateString());

      spy.mockRestore();
    });
  });
});
