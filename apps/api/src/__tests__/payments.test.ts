/**
 * Integration tests for Phase 4: Payments and Course Access.
 */
import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "@prisma/client";
import { chapaService } from "../modules/payments/chapa.service";

function makeToken(role: Role, id = "test-payment-user-id") {
  return jwt.sign(
    { userId: id, email: "payuser@blih.com", role },
    env.jwtSecret,
    {
      expiresIn: "1h",
    },
  );
}

function userCookie(id = "test-payment-user-id", role = Role.TALENT) {
  return ["token=" + makeToken(role, id)];
}

jest.setTimeout(30000);

describe("Phase 4 Payments & Access System", () => {
  jest.setTimeout(30000);

  const testUserId = "test-payment-user-id";
  const secondUserId = "test-second-user-id";
  let createdCourseId: string;

  beforeAll(async () => {
    // Clean up test data
    await prisma.skillsEntitlement.deleteMany({
      where: { userId: { in: [testUserId, secondUserId] } },
    });
    await prisma.paymentTransaction.deleteMany({
      where: { userId: { in: [testUserId, secondUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, secondUserId] } },
    });

    // Create test user 1
    await prisma.user.create({
      data: {
        id: testUserId,
        email: "payuser@blih.com",
        passwordHash: "dummy",
        role: Role.TALENT,
        emailVerified: true,
      },
    });

    // Create test user 2
    await prisma.user.create({
      data: {
        id: secondUserId,
        email: "payuser2@blih.com",
        passwordHash: "dummy",
        role: Role.TALENT,
        emailVerified: true,
      },
    });

    // Create a published test course with a lesson
    const course = await prisma.course.create({
      data: {
        title: "Test Payment Course",
        description: "Course for testing payment protection",
        status: "PUBLISHED",
        lessons: {
          create: {
            title: "Lesson 1 Protected Content",
            content: "Secret protected lesson material",
            order: 0,
          },
        },
      },
    });
    createdCourseId = course.id;
  });

  afterAll(async () => {
    await prisma.skillsEntitlement.deleteMany({
      where: { userId: { in: [testUserId, secondUserId] } },
    });
    await prisma.paymentTransaction.deleteMany({
      where: { userId: { in: [testUserId, secondUserId] } },
    });
    if (createdCourseId) {
      await prisma.course.delete({ where: { id: createdCourseId } });
    }
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, secondUserId] } },
    });
    await prisma.$disconnect();
  });

  describe("1. Course Content Protection (Pre-Payment)", () => {
    it("should allow public catalog preview for unauthenticated users", async () => {
      const res = await request(app).get(
        `/api/v1/courses/public/${createdCourseId}`,
      );
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Test Payment Course");
      expect(res.body.lessons[0].content).toBeUndefined(); // Sensitive content hidden
    });

    it("should reject access to protected course content for non-paying users (403 Forbidden)", async () => {
      const res = await request(app)
        .get(`/api/v1/courses/${createdCourseId}/learn`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(403);
      expect(res.body.error.message).toMatch(/Skills payment required/i);
    });
  });

  describe("2. Payment Initialization & Verification Flow", () => {
    let activeTxRef: string;

    it("should initialize 1,000 ETB Skills payment successfully", async () => {
      const res = await request(app)
        .post("/api/v1/payments/skills/initialize")
        .set("Cookie", userCookie(testUserId))
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.alreadyHasAccess).toBe(false);
      expect(res.body.checkoutUrl).toBeDefined();
      expect(res.body.txRef).toMatch(/^blih_skills_/);

      activeTxRef = res.body.txRef;

      // Verify DB status is PENDING
      const dbTx = await prisma.paymentTransaction.findUnique({
        where: { txRef: activeTxRef },
      });
      expect(dbTx?.status).toBe("PENDING");
      expect(dbTx?.amount).toBe(1000);
      expect(dbTx?.currency).toBe("ETB");
    });

    it("should reject verification for fake or non-existent tx_ref", async () => {
      const res = await request(app)
        .get("/api/v1/payments/verify/invalid_tx_ref_12345")
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(404);
    });

    it("should reject payment verification if currency is wrong (not ETB)", async () => {
      // Mock Chapa verification returning wrong currency
      const spy = jest
        .spyOn(chapaService, "verifyPayment")
        .mockResolvedValueOnce({
          txRef: activeTxRef,
          amount: 1000,
          currency: "USD", // Wrong currency
          status: "success",
        });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${activeTxRef}`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/Invalid currency \(USD\)/i);

      spy.mockRestore();
    });

    it("should reject payment verification if amount is less than 1,000 ETB", async () => {
      const spy = jest
        .spyOn(chapaService, "verifyPayment")
        .mockResolvedValueOnce({
          txRef: activeTxRef,
          amount: 500, // Insufficient amount
          currency: "ETB",
          status: "success",
        });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${activeTxRef}`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(
        /Paid amount \(500 ETB\) is less than required \(1000 ETB\)/i,
      );

      spy.mockRestore();
    });

    it("should handle failed gateway response cleanly and support retry", async () => {
      const spy = jest
        .spyOn(chapaService, "verifyPayment")
        .mockResolvedValueOnce({
          txRef: activeTxRef,
          amount: 1000,
          currency: "ETB",
          status: "failed",
        });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${activeTxRef}`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(400);

      // Verify payment marked FAILED in DB
      const failedDbTx = await prisma.paymentTransaction.findUnique({
        where: { txRef: activeTxRef },
      });
      expect(failedDbTx?.status).toBe("FAILED");

      spy.mockRestore();

      // User should be able to retry initializing a new payment
      const retryRes = await request(app)
        .post("/api/v1/payments/skills/initialize")
        .set("Cookie", userCookie(testUserId))
        .send({});

      expect(retryRes.status).toBe(200);
      expect(retryRes.body.alreadyHasAccess).toBe(false);
      expect(retryRes.body.txRef).toBeDefined();

      // Set activeTxRef to new transaction for successful verification
      activeTxRef = retryRes.body.txRef;
    });

    it("should verify payment successfully, grant entitlement, and create notification", async () => {
      const spy = jest
        .spyOn(chapaService, "verifyPayment")
        .mockResolvedValueOnce({
          txRef: activeTxRef,
          amount: 1000,
          currency: "ETB",
          status: "success",
          chapaRef: "CHAPA-TEST-REF-999",
        });

      const res = await request(app)
        .get(`/api/v1/payments/verify/${activeTxRef}`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);
      expect(res.body.payment.status).toBe("SUCCESSFUL");
      expect(res.body.entitlement).toBeDefined();
      expect(res.body.entitlement.userId).toBe(testUserId);

      spy.mockRestore();

      // Check notification was created
      const notifs = await prisma.notification.findMany({
        where: { userId: testUserId },
      });
      expect(notifs.length).toBeGreaterThan(0);
      expect(notifs[0].type).toBe("SKILLS_PAYMENT_SUCCESS");
    });

    it("should handle duplicate verification/webhooks idempotently", async () => {
      // Second call to verify the exact same txRef
      const res = await request(app)
        .get(`/api/v1/payments/verify/${activeTxRef}`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);
      expect(res.body.message).toMatch(/already successfully verified/i);

      // Verify only 1 entitlement exists
      const entitlements = await prisma.skillsEntitlement.findMany({
        where: { userId: testUserId },
      });
      expect(entitlements.length).toBe(1);
    });
  });

  describe("3. Post-Payment Entitlement & Protected Content Access", () => {
    it("should report hasAccess = true on access status endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/payments/skills/access-status")
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(200);
      expect(res.body.hasAccess).toBe(true);
      expect(res.body.grantedAt).toBeDefined();
    });

    it("should allow paid user to access protected course content", async () => {
      const res = await request(app)
        .get(`/api/v1/courses/${createdCourseId}/learn`)
        .set("Cookie", userCookie(testUserId));

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Test Payment Course");
      expect(res.body.lessons[0].content).toBe(
        "Secret protected lesson material",
      );
    });

    it("should return alreadyHasAccess = true if an entitled user tries to initiate payment again", async () => {
      const res = await request(app)
        .post("/api/v1/payments/skills/initialize")
        .set("Cookie", userCookie(testUserId))
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.alreadyHasAccess).toBe(true);
      expect(res.body.checkoutUrl).toBeNull();
    });
  });
});
