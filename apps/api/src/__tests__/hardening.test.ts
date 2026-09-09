import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "@prisma/client";

function makeToken(role: Role, userId: string, email: string) {
  return jwt.sign({ userId, email, role }, env.jwtSecret, { expiresIn: "1h" });
}

function userCookie(role: Role, userId: string, email: string) {
  return ["token=" + makeToken(role, userId, email)];
}

jest.mock("../config/prisma", () => ({
  $queryRaw: jest.fn(),
  user: {
    findUnique: jest.fn(),
  },
  talentProfile: {
    findUnique: jest.fn(),
  },
  companyProfile: {
    findUnique: jest.fn(),
  },
  job: {
    findUnique: jest.fn(),
  },
  jobApplication: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  paymentTransaction: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
}));

describe("Phase 10 System Hardening & Security Matrix", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.user.findUnique as jest.Mock).mockImplementation(
      async ({ where }) => {
        if (where.id === "user-tal-1") {
          return {
            id: "user-tal-1",
            email: "talent@blih.com",
            role: Role.TALENT,
            emailVerified: true,
          };
        }
        if (where.id === "user-comp-1") {
          return {
            id: "user-comp-1",
            email: "company@blih.com",
            role: Role.COMPANY,
            emailVerified: true,
          };
        }
        if (where.id === "user-comp-unsub") {
          return {
            id: "user-comp-unsub",
            email: "unsub@company.com",
            role: Role.COMPANY,
            emailVerified: true,
          };
        }
        if (where.id === "user-comp-A") {
          return {
            id: "user-comp-A",
            email: "compA@company.com",
            role: Role.COMPANY,
            emailVerified: true,
          };
        }
        return null;
      },
    );
  });

  describe("1. Health Check Endpoint", () => {
    it("returns 200 OK with connected database status", async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ "?column?": 1 }]);
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.database).toBe("connected");
    });
  });

  describe("2. Authentication & Authorization Matrix", () => {
    it("returns 401 Unauthorized for unauthenticated requests to protected endpoints", async () => {
      const res = await request(app).get("/api/v1/applications/mine");
      expect(res.status).toBe(401);
    });

    it("returns 403 Forbidden when TALENT role accesses COMPANY-only endpoints", async () => {
      const res = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", userCookie(Role.TALENT, "user-tal-1", "talent@blih.com"))
        .send({ title: "Test Job" });

      expect(res.status).toBe(403);
      expect(res.body.error.message).toMatch(/Access denied/i);
    });

    it("returns 403 Forbidden when COMPANY role accesses TALENT-only endpoints", async () => {
      const res = await request(app)
        .post("/api/v1/applications")
        .set(
          "Cookie",
          userCookie(Role.COMPANY, "user-comp-1", "company@blih.com"),
        )
        .send({ jobId: "job-1" });

      expect(res.status).toBe(403);
      expect(res.body.error.message).toMatch(/Access denied/i);
    });

    it("returns 403 Forbidden when non-ADMIN accesses ADMIN routes", async () => {
      const res = await request(app)
        .post("/api/v1/admin/courses")
        .set("Cookie", userCookie(Role.TALENT, "user-tal-1", "talent@blih.com"))
        .send({ title: "New Admin Course" });

      expect(res.status).toBe(403);
    });
  });

  describe("3. Subscription Gating & Cross-Tenant Security", () => {
    it("returns 402 Payment Required when unsubscribed company views talent profile", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-profile-1",
        userId: "user-comp-unsub",
        subscriptionActive: false,
        subscriptionExpiresAt: null,
      });

      const res = await request(app)
        .get("/api/v1/talents/tal-target-id")
        .set(
          "Cookie",
          userCookie(Role.COMPANY, "user-comp-unsub", "unsub@company.com"),
        );

      expect(res.status).toBe(402);
      expect(res.body.error.message).toMatch(/subscription/i);
    });

    it("returns 403 Forbidden when company views applications of a job belonging to another company", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-A",
        userId: "user-comp-A",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-B",
        companyProfileId: "comp-B",
      });

      const res = await request(app)
        .get("/api/v1/applications/job/job-B")
        .set(
          "Cookie",
          userCookie(Role.COMPANY, "user-comp-A", "compA@company.com"),
        );

      expect(res.status).toBe(403);
      expect(res.body.error.message).toMatch(/do not have access/i);
    });
  });

  describe("4. Job & Application Security Rules", () => {
    it("rejects application status update if status transition is not SUBMITTED -> IN_REVIEW", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-1",
        userId: "user-comp-1",
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue({
        id: "app-1",
        status: "IN_REVIEW",
        job: { companyProfileId: "comp-1" },
      });

      const res = await request(app)
        .patch("/api/v1/applications/app-1/status")
        .set(
          "Cookie",
          userCookie(Role.COMPANY, "user-comp-1", "company@blih.com"),
        )
        .send({ status: "SUBMITTED" });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(
        /Only status change from Applied/i,
      );
    });
  });
});
