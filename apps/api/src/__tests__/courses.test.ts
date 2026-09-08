/**
 * Integration tests for the courses module.
 * Requires: database running + DATABASE_URL set in env.
 * Run: npm test
 */
import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "@prisma/client";

// ─── Auth helpers ──────────────────────────────────────────────────────────────

function makeToken(role: Role, id = "test-user-id") {
  return jwt.sign({ userId: id, email: "test@blih.com", role }, env.jwtSecret, {
    expiresIn: "1h",
  });
}

function adminCookie() {
  return ["token=" + makeToken(Role.ADMIN, "course-admin-user-id")];
}

function talentCookie() {
  return ["token=" + makeToken(Role.TALENT, "course-talent-user-id")];
}

jest.setTimeout(30000);

// ─── Setup & Cleanup ──────────────────────────────────────────────────────────

beforeAll(async () => {
  // Create test admin
  await prisma.user.upsert({
    where: { id: "course-admin-user-id" },
    update: {},
    create: {
      id: "course-admin-user-id",
      email: "coursetestadmin@blih.com",
      passwordHash: "dummy",
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  // Create test talent
  await prisma.user.upsert({
    where: { id: "course-talent-user-id" },
    update: {},
    create: {
      id: "course-talent-user-id",
      email: "coursetesttalent@blih.com",
      passwordHash: "dummy",
      role: Role.TALENT,
      emailVerified: true,
    },
  });
});

afterAll(async () => {
  await prisma.course.deleteMany({
    where: { title: { startsWith: "[TEST]" } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: ["course-admin-user-id", "course-talent-user-id"] } },
  });
  await prisma.$disconnect();
});

// ─── Authorization ────────────────────────────────────────────────────────────

describe("Course authorization", () => {
  it("GET /api/v1/courses returns 200 without auth (public)", async () => {
    const res = await request(app).get("/api/v1/courses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/v1/courses/admin returns 401 without auth", async () => {
    const res = await request(app).get("/api/v1/courses/admin");
    expect(res.status).toBe(401);
  });

  it("GET /api/v1/courses/admin returns 403 for TALENT role", async () => {
    const res = await request(app)
      .get("/api/v1/courses/admin")
      .set("Cookie", talentCookie());
    expect(res.status).toBe(403);
  });

  it("POST /api/v1/courses returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/courses")
      .send({ title: "x", description: "y" });
    expect(res.status).toBe(401);
  });
});

// ─── CRUD ─────────────────────────────────────────────────────────────────────

describe("Course CRUD", () => {
  let courseId: string;

  it("creates a course as admin", async () => {
    const res = await request(app)
      .post("/api/v1/courses")
      .set("Cookie", adminCookie())
      .send({
        title: "[TEST] Course 1",
        description: "A test course description.",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("[TEST] Course 1");
    expect(res.body.status).toBe("DRAFT");
    courseId = res.body.id;
  });

  it("lists the course in admin list", async () => {
    const res = await request(app)
      .get("/api/v1/courses/admin")
      .set("Cookie", adminCookie());
    expect(res.status).toBe(200);
    expect(res.body.some((c: any) => c.id === courseId)).toBe(true);
  });

  it("does NOT show draft course in public list", async () => {
    const res = await request(app).get("/api/v1/courses");
    expect(res.status).toBe(200);
    expect(res.body.some((c: any) => c.id === courseId)).toBe(false);
  });

  it("updates course title and description", async () => {
    const res = await request(app)
      .patch("/api/v1/courses/" + courseId)
      .set("Cookie", adminCookie())
      .send({ title: "[TEST] Course 1 Updated" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("[TEST] Course 1 Updated");
  });

  // ── Lessons ──────────────────────────────────────────────────────────
  let lessonId: string;
  let lesson2Id: string;

  it("creates a lesson", async () => {
    const res = await request(app)
      .post("/api/v1/courses/" + courseId + "/lessons")
      .set("Cookie", adminCookie())
      .send({ title: "[TEST] Lesson 1", content: "Hello world" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("[TEST] Lesson 1");
    expect(res.body.order).toBe(0);
    lessonId = res.body.id;
  });

  it("creates a second lesson", async () => {
    const res = await request(app)
      .post("/api/v1/courses/" + courseId + "/lessons")
      .set("Cookie", adminCookie())
      .send({ title: "[TEST] Lesson 2" });
    expect(res.status).toBe(201);
    expect(res.body.order).toBe(1);
    lesson2Id = res.body.id;
  });

  it("updates lesson title", async () => {
    const res = await request(app)
      .patch("/api/v1/courses/" + courseId + "/lessons/" + lessonId)
      .set("Cookie", adminCookie())
      .send({ title: "[TEST] Lesson 1 Updated" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("[TEST] Lesson 1 Updated");
  });

  it("publishes the course", async () => {
    const res = await request(app)
      .post("/api/v1/courses/" + courseId + "/publish")
      .set("Cookie", adminCookie());
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("PUBLISHED");
  });

  it("shows published course in public list", async () => {
    const res = await request(app).get("/api/v1/courses");
    expect(res.status).toBe(200);
    expect(res.body.some((c: any) => c.id === courseId)).toBe(true);
  });

  it("unpublishes the course", async () => {
    const res = await request(app)
      .post("/api/v1/courses/" + courseId + "/unpublish")
      .set("Cookie", adminCookie());
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("DRAFT");
  });

  it("returns 404 for unpublished course from public endpoint", async () => {
    const res = await request(app).get("/api/v1/courses/public/" + courseId);
    expect(res.status).toBe(404);
  });

  it("reorders lessons", async () => {
    const res = await request(app)
      .post("/api/v1/courses/" + courseId + "/lessons/reorder")
      .set("Cookie", adminCookie())
      .send({
        lessons: [
          { id: lessonId, order: 1 },
          { id: lesson2Id, order: 0 },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body.lessons[0].id).toBe(lesson2Id);
  });

  // ── Quiz ─────────────────────────────────────────────────────────────

  it("creates a quiz", async () => {
    const res = await request(app)
      .put("/api/v1/courses/" + courseId + "/lessons/" + lessonId + "/quiz")
      .set("Cookie", adminCookie())
      .send({
        title: "Chapter Quiz",
        questions: [
          {
            text: "What is 2+2?",
            options: ["3", "4", "5"],
            correctOptionIndex: 1,
          },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Chapter Quiz");
  });

  // ── Assignment ────────────────────────────────────────────────────────

  it("creates an assignment", async () => {
    const res = await request(app)
      .put(
        "/api/v1/courses/" + courseId + "/lessons/" + lessonId + "/assignment",
      )
      .set("Cookie", adminCookie())
      .send({ title: "Practice Exercise", instructions: "Do the thing." });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Practice Exercise");
  });

  // ── Validation ────────────────────────────────────────────────────────

  it("rejects course creation with missing title", async () => {
    const res = await request(app)
      .post("/api/v1/courses")
      .set("Cookie", adminCookie())
      .send({ description: "No title here" });
    expect(res.status).toBe(400);
  });

  it("deletes lesson", async () => {
    const res = await request(app)
      .delete("/api/v1/courses/" + courseId + "/lessons/" + lesson2Id)
      .set("Cookie", adminCookie());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
