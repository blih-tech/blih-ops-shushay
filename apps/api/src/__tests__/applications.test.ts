import {
  applyToJob,
  getTalentApplications,
  getJobApplicationsForCompany,
  updateApplicationStatus,
} from "../modules/applications/application.service";
import prisma from "../config/prisma";
import { JobStatus, ApplicationStatus } from "@prisma/client";

jest.mock("../config/prisma", () => ({
  companyProfile: {
    findUnique: jest.fn(),
  },
  talentProfile: {
    findUnique: jest.fn(),
  },
  job: {
    findUnique: jest.fn(),
  },
  jobApplication: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
}));

describe("Application Service & Authorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("applyToJob", () => {
    it("creates job application and notifies company", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-101",
        userId: "user-talent-1",
        fullName: "Abebe Bikila",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-202",
        title: "Senior Backend Developer",
        status: JobStatus.ACTIVE,
        companyProfile: {
          id: "comp-303",
          userId: "user-company-1",
          contactEmail: "hr@acme.com",
          user: { email: "owner@acme.com" },
        },
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.jobApplication.create as jest.Mock).mockResolvedValue({
        id: "app-404",
        jobId: "job-202",
        talentProfileId: "tal-101",
        status: ApplicationStatus.SUBMITTED,
      });

      (prisma.notification.create as jest.Mock).mockResolvedValue({
        id: "notif-1",
      });

      const res = await applyToJob("user-talent-1", {
        jobId: "job-202",
        coverLetter: "Highly interested in this opportunity.",
      });

      expect(res.id).toBe("app-404");
      expect(prisma.jobApplication.create).toHaveBeenCalled();
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-company-1",
          type: "NEW_JOB_APPLICATION",
        }),
      });
    });

    it("rejects application when job is CLOSED", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-101",
        userId: "user-talent-1",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-closed",
        status: JobStatus.CLOSED,
        companyProfile: { userId: "user-comp" },
      });

      await expect(
        applyToJob("user-talent-1", { jobId: "job-closed" }),
      ).rejects.toThrow("This job is closed and no longer accepting applications.");
    });

    it("rejects duplicate application for the same job and talent", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-101",
        userId: "user-talent-1",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-202",
        status: JobStatus.ACTIVE,
        companyProfile: { userId: "user-comp" },
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue({
        id: "app-existing",
        jobId: "job-202",
        talentProfileId: "tal-101",
      });

      await expect(
        applyToJob("user-talent-1", { jobId: "job-202" }),
      ).rejects.toThrow("You have already submitted an application for this job.");
    });
  });

  describe("getTalentApplications", () => {
    it("returns empty array if talent profile does not exist", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue(null);
      const res = await getTalentApplications("user-no-profile");
      expect(res).toEqual([]);
    });

    it("returns list of applications for current talent", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-101",
        userId: "user-talent-1",
      });

      (prisma.jobApplication.findMany as jest.Mock).mockResolvedValue([
        { id: "app-1", jobId: "job-1", status: ApplicationStatus.SUBMITTED },
      ]);

      const res = await getTalentApplications("user-talent-1");
      expect(res).toHaveLength(1);
      expect(prisma.jobApplication.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { talentProfileId: "tal-101" },
        }),
      );
    });
  });

  describe("getJobApplicationsForCompany & updateApplicationStatus", () => {
    it("denies access if company tries to view applications for job belonging to another company", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-my-company",
        userId: "user-comp-1",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-other",
        companyProfileId: "comp-other-company",
      });

      await expect(
        getJobApplicationsForCompany("job-other", "user-comp-1"),
      ).rejects.toThrow("You do not have access to applications for this job.");
    });

    it("allows company to update status from SUBMITTED (Applied) to IN_REVIEW (Reviewing)", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-101",
        userId: "user-comp-1",
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue({
        id: "app-303",
        status: ApplicationStatus.SUBMITTED,
        job: { companyProfileId: "comp-101" },
      });

      (prisma.jobApplication.update as jest.Mock).mockResolvedValue({
        id: "app-303",
        status: ApplicationStatus.IN_REVIEW,
      });

      const updated = await updateApplicationStatus(
        "app-303",
        "user-comp-1",
        ApplicationStatus.IN_REVIEW,
      );

      expect(updated.status).toBe(ApplicationStatus.IN_REVIEW);
      expect(prisma.jobApplication.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "app-303" },
          data: { status: ApplicationStatus.IN_REVIEW },
        }),
      );
    });

    it("prevents invalid status updates not adhering to Applied -> Reviewing", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-101",
        userId: "user-comp-1",
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue({
        id: "app-303",
        status: ApplicationStatus.IN_REVIEW,
        job: { companyProfileId: "comp-101" },
      });

      await expect(
        updateApplicationStatus(
          "app-303",
          "user-comp-1",
          ApplicationStatus.SUBMITTED,
        ),
      ).rejects.toThrow(
        "Only status change from Applied (SUBMITTED) to Reviewing (IN_REVIEW) is allowed.",
      );
    });
  });
});
