import {
  checkAndGenerateCertificate,
  getUserCertificates,
  getCertificateById,
} from "../modules/certificates/certificate.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
  course: {
    findUnique: jest.fn(),
  },
  lessonProgress: {
    count: jest.fn(),
  },
  certificate: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
}));

describe("Certificates Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkAndGenerateCertificate", () => {
    it("should return null if course is not 100% completed", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-1",
        title: "Python Fundamentals",
        lessons: [{ id: "l1" }, { id: "l2" }],
      });
      (prisma.lessonProgress.count as jest.Mock).mockResolvedValue(1); // 1 out of 2

      const cert = await checkAndGenerateCertificate("user-1", "course-1");
      expect(cert).toBeNull();
      expect(prisma.certificate.create).not.toHaveBeenCalled();
    });

    it("should create a new certificate if course is 100% completed and cert does not exist", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-1",
        title: "Python Fundamentals",
        lessons: [{ id: "l1" }, { id: "l2" }],
      });
      (prisma.lessonProgress.count as jest.Mock).mockResolvedValue(2); // 2 out of 2
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.certificate.create as jest.Mock).mockResolvedValue({
        id: "cert-1",
        userId: "user-1",
        courseId: "course-1",
        certificateNumber: "BLIH-CERT-12345-VERIFIED",
        issueDate: new Date(),
        course: { id: "course-1", title: "Python Fundamentals" },
      });

      const cert = await checkAndGenerateCertificate("user-1", "course-1");
      expect(cert).toBeDefined();
      expect(cert?.certificateNumber).toContain("BLIH-CERT-");
      expect(prisma.certificate.create).toHaveBeenCalledTimes(1);
    });

    it("should be idempotent and return existing certificate if already generated", async () => {
      const existing = {
        id: "cert-existing",
        userId: "user-1",
        courseId: "course-1",
        certificateNumber: "BLIH-CERT-EXISTING-VERIFIED",
        issueDate: new Date(),
        course: { id: "course-1", title: "Python Fundamentals" },
      };

      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-1",
        title: "Python Fundamentals",
        lessons: [{ id: "l1" }, { id: "l2" }],
      });
      (prisma.lessonProgress.count as jest.Mock).mockResolvedValue(2);
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(existing);

      const cert = await checkAndGenerateCertificate("user-1", "course-1");
      expect(cert).toEqual(existing);
      expect(prisma.certificate.create).not.toHaveBeenCalled();
    });
  });

  describe("getCertificateById Authorization", () => {
    it("should allow certificate owner to retrieve certificate", async () => {
      const mockCert = {
        id: "cert-1",
        userId: "user-owner",
        courseId: "course-1",
        certificateNumber: "BLIH-CERT-111",
        user: { id: "user-owner", email: "talent@blih.com" },
        course: { id: "course-1", title: "Python Fundamentals" },
      };
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(mockCert);

      const result = await getCertificateById("cert-1", {
        id: "user-owner",
        role: "TALENT",
      });
      expect(result).toEqual(mockCert);
    });

    it("should throw 403 if a different TALENT user attempts to access certificate", async () => {
      const mockCert = {
        id: "cert-1",
        userId: "user-owner",
        courseId: "course-1",
        certificateNumber: "BLIH-CERT-111",
        user: { id: "user-owner", email: "talent@blih.com" },
        course: { id: "course-1", title: "Python Fundamentals" },
      };
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(mockCert);

      await expect(
        getCertificateById("cert-1", {
          id: "user-other",
          role: "TALENT",
        }),
      ).rejects.toThrow("Access denied. You do not own this certificate.");
    });
  });
});
