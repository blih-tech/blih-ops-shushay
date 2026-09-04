import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "@prisma/client";

// Mock Cloudinary SDK
const mockUploadStream = jest.fn();
const mockDestroy = jest.fn();

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: (options: any, callback: any) => {
        mockUploadStream(options, callback);
        return {
          write: jest.fn(),
          end: jest.fn(() => {
            callback(null, {
              secure_url: `https://res.cloudinary.com/demo/image/upload/v12345/${options.folder || "temp"}/test-id.png`,
              public_id: `${options.folder || "temp"}/test-id`,
            });
          }),
          pipe: jest.fn(function (this: any, dest: any) {
            setTimeout(() => {
              callback(null, {
                secure_url: `https://res.cloudinary.com/demo/image/upload/v12345/${options.folder || "temp"}/test-id.png`,
                public_id: `${options.folder || "temp"}/test-id`,
              });
            }, 10);
            return dest;
          }),
        };
      },
      destroy: (publicId: string, options: any, callback?: any) => {
        const res = mockDestroy(publicId, options);
        if (callback) callback(null, { result: "ok" });
        return Promise.resolve({ result: "ok" });
      },
    },
  },
}));

// Helper tokens
function makeToken(role: Role, id: string) {
  return jwt.sign(
    { userId: id, email: `${role.toLowerCase()}@blih.com`, role },
    env.jwtSecret,
    { expiresIn: "1h" },
  );
}

describe("Cloudinary Upload & Delete Flow Tests", () => {
  const talentUserId = "test-talent-upload-id";
  const companyUserId = "test-company-upload-id";
  const adminUserId = "admin-user-id";
  let courseId: string;
  let lessonId: string;

  beforeAll(async () => {
    // Setup users in test DB
    await prisma.user.upsert({
      where: { id: talentUserId },
      update: {},
      create: {
        id: talentUserId,
        email: "talentupload@blih.com",
        passwordHash: "dummy",
        role: Role.TALENT,
        emailVerified: true,
      },
    });

    await prisma.user.upsert({
      where: { id: companyUserId },
      update: {},
      create: {
        id: companyUserId,
        email: "companyupload@blih.com",
        passwordHash: "dummy",
        role: Role.COMPANY,
        emailVerified: true,
      },
    });

    await prisma.user.upsert({
      where: { id: adminUserId },
      update: {},
      create: {
        id: adminUserId,
        email: "testadmin@blih.com",
        passwordHash: "dummy",
        role: Role.ADMIN,
        emailVerified: true,
      },
    });

    // Create course and lesson
    const course = await prisma.course.create({
      data: {
        title: "Cloudinary Integration Test Course",
        description: "Testing uploads",
      },
    });
    courseId = course.id;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title: "[TEST] Upload Lesson",
        order: 0,
      },
    });
    lessonId = lesson.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.course.deleteMany({ where: { id: courseId } });
    await prisma.user.deleteMany({
      where: { id: { in: [talentUserId, companyUserId, adminUserId] } },
    });
    await prisma.$disconnect();
  });

  beforeEach(() => {
    mockUploadStream.mockClear();
    mockDestroy.mockClear();
  });

  describe("Talent Profile Uploads", () => {
    it("uploads and deletes profile photo via Cloudinary successfully", async () => {
      mockUploadStream.mockImplementation((options, callback) => {
        callback(null, {
          secure_url:
            "https://res.cloudinary.com/demo/image/upload/v1/blih/talents/photos/photo.png",
          public_id: "blih/talents/photos/photo",
        });
        return { end: jest.fn(), pipe: jest.fn() };
      });

      const res = await request(app)
        .post("/api/v1/talents/profile/photo")
        .set("Cookie", ["token=" + makeToken(Role.TALENT, talentUserId)])
        .attach("photo", Buffer.from("fake-image-bytes"), "photo.png");

      expect(res.status).toBe(200);
      expect(res.body.photoUrl).toBe(
        "https://res.cloudinary.com/demo/image/upload/v1/blih/talents/photos/photo.png",
      );

      // Verify Cloudinary options
      expect(mockUploadStream).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: "blih/talents/photos",
          resource_type: "image",
        }),
        expect.any(Function),
      );

      // Now test deletion
      const delRes = await request(app)
        .delete("/api/v1/talents/profile/photo")
        .set("Cookie", ["token=" + makeToken(Role.TALENT, talentUserId)]);

      expect(delRes.status).toBe(200);
      expect(delRes.body.photoUrl).toBeNull();
      expect(mockDestroy).toHaveBeenCalledWith("blih/talents/photos/photo", {
        resource_type: "image",
      });
    });

    it("uploads and deletes CV via Cloudinary successfully", async () => {
      mockUploadStream.mockImplementation((options, callback) => {
        callback(null, {
          secure_url:
            "https://res.cloudinary.com/demo/image/upload/v1/blih/talents/cvs/cv.pdf",
          public_id: "blih/talents/cvs/cv",
        });
        return { end: jest.fn(), pipe: jest.fn() };
      });

      const res = await request(app)
        .post("/api/v1/talents/profile/cv")
        .set("Cookie", ["token=" + makeToken(Role.TALENT, talentUserId)])
        .attach("cv", Buffer.from("%PDF-1.4 fake pdf"), "cv.pdf");

      expect(res.status).toBe(200);
      expect(res.body.cvUrl).toBe(
        "https://res.cloudinary.com/demo/image/upload/v1/blih/talents/cvs/cv.pdf",
      );

      // Delete CV
      const delRes = await request(app)
        .delete("/api/v1/talents/profile/cv")
        .set("Cookie", ["token=" + makeToken(Role.TALENT, talentUserId)]);

      expect(delRes.status).toBe(200);
      expect(mockDestroy).toHaveBeenCalledWith("blih/talents/cvs/cv", {
        resource_type: "raw",
      });
    });
  });

  describe("Company Profile Uploads", () => {
    it("uploads and deletes company logo via Cloudinary successfully", async () => {
      mockUploadStream.mockImplementation((options, callback) => {
        callback(null, {
          secure_url:
            "https://res.cloudinary.com/demo/image/upload/v1/blih/companies/logos/logo.png",
          public_id: "blih/companies/logos/logo",
        });
        return { end: jest.fn(), pipe: jest.fn() };
      });

      const res = await request(app)
        .post("/api/v1/companies/profile/logo")
        .set("Cookie", ["token=" + makeToken(Role.COMPANY, companyUserId)])
        .attach("logo", Buffer.from("fake-logo-bytes"), "logo.png");

      expect(res.status).toBe(200);
      expect(res.body.logoUrl).toBe(
        "https://res.cloudinary.com/demo/image/upload/v1/blih/companies/logos/logo.png",
      );

      // Delete logo
      const delRes = await request(app)
        .delete("/api/v1/companies/profile/logo")
        .set("Cookie", ["token=" + makeToken(Role.COMPANY, companyUserId)]);

      expect(delRes.status).toBe(200);
      expect(mockDestroy).toHaveBeenCalledWith("blih/companies/logos/logo", {
        resource_type: "image",
      });
    });
  });

  describe("Course & Lesson Uploads", () => {
    it("uploads lesson video and document successfully", async () => {
      // Video upload (disk storage path stream upload)
      const res = await request(app)
        .post(`/api/v1/courses/${courseId}/lessons/${lessonId}/video`)
        .set("Cookie", ["token=" + makeToken(Role.ADMIN, adminUserId)])
        .attach("video", Buffer.from("fake-video-bytes"), "video.mp4");

      expect(res.status).toBe(200);
      expect(res.body.videoUrl).toBeDefined();

      // Document upload
      const docRes = await request(app)
        .post(`/api/v1/courses/${courseId}/lessons/${lessonId}/documents`)
        .set("Cookie", ["token=" + makeToken(Role.ADMIN, adminUserId)])
        .attach("document", Buffer.from("%PDF-1.4 doc bytes"), "notes.pdf");

      expect(docRes.status).toBe(201);
      expect(docRes.body.id).toBeDefined();
    });
  });

  describe("Orphan Cleanups (Database Save Failure)", () => {
    it("deletes newly uploaded asset from Cloudinary if database save throws error", async () => {
      // Mock db save to fail
      const originalUpdate = prisma.talentProfile.update;
      prisma.talentProfile.update = jest
        .fn()
        .mockRejectedValue(new Error("Fake DB Save Error"));

      mockUploadStream.mockImplementation((options, callback) => {
        callback(null, {
          secure_url:
            "https://res.cloudinary.com/demo/image/upload/v1/blih/talents/photos/orphan.png",
          public_id: "blih/talents/photos/orphan",
        });
        return { end: jest.fn(), pipe: jest.fn() };
      });

      const res = await request(app)
        .post("/api/v1/talents/profile/photo")
        .set("Cookie", ["token=" + makeToken(Role.TALENT, talentUserId)])
        .attach("photo", Buffer.from("fake-image-bytes"), "photo.png");

      expect(res.status).toBe(500); // DB failure returns 500 error
      // Verify destroy was called to cleanup the orphan
      expect(mockDestroy).toHaveBeenCalledWith("blih/talents/photos/orphan", {
        resource_type: "image",
      });

      // Restore original prisma method
      prisma.talentProfile.update = originalUpdate;
    });
  });
});
