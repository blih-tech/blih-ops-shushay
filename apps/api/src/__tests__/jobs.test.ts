import {
  createJob,
  getJobById,
  updateJob,
  closeJob,
  listActiveJobs,
} from "../modules/jobs/job.service";
import { applyToJob } from "../modules/applications/application.service";
import prisma from "../config/prisma";
import { JobStatus, EmploymentType, ExperienceLevel } from "@prisma/client";

jest.mock("../config/prisma", () => ({
  companyProfile: {
    findUnique: jest.fn(),
  },
  talentProfile: {
    findUnique: jest.fn(),
  },
  job: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  jobApplication: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("Job and Application Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("creates a job for an authenticated company", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-1",
        userId: "user-comp",
      });

      const mockJobData = {
        title: "Fullstack Engineer",
        description: "Looking for an experienced fullstack engineer.",
        requiredSkills: ["React", "Node.js"],
        employmentType: EmploymentType.FULL_TIME,
        experienceLevel: ExperienceLevel.SENIOR,
        salaryCurrency: "USD",
        countryRestrictions: [],
      };

      (prisma.job.create as jest.Mock).mockResolvedValue({
        id: "job-1",
        companyProfileId: "comp-1",
        status: JobStatus.ACTIVE,
        ...mockJobData,
      });

      const result = await createJob("user-comp", mockJobData as any);
      expect(result.id).toBe("job-1");
      expect(prisma.job.create).toHaveBeenCalled();
    });
  });

  describe("getJobById", () => {
    it("returns job details by ID", async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-1",
        title: "Frontend Lead",
        status: JobStatus.ACTIVE,
      });

      const job = await getJobById("job-1");
      expect(job.title).toBe("Frontend Lead");
    });

    it("throws 404 when job does not exist", async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(getJobById("non-existent")).rejects.toThrow(
        "Job not found.",
      );
    });
  });

  describe("updateJob", () => {
    it("prohibits editing a closed job", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-1",
        userId: "user-comp",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-1",
        companyProfileId: "comp-1",
        status: JobStatus.CLOSED,
      });

      await expect(
        updateJob("job-1", "user-comp", { title: "New Title" } as any),
      ).rejects.toThrow("Closed jobs cannot be edited.");
    });
  });

  describe("closeJob", () => {
    it("sets status to CLOSED", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-1",
        userId: "user-comp",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-1",
        companyProfileId: "comp-1",
        status: JobStatus.ACTIVE,
      });

      (prisma.job.update as jest.Mock).mockResolvedValue({
        id: "job-1",
        status: JobStatus.CLOSED,
      });

      const res = await closeJob("job-1", "user-comp");
      expect(res.status).toBe(JobStatus.CLOSED);
      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: "job-1" },
        data: { status: JobStatus.CLOSED },
      });
    });
  });

  describe("applyToJob", () => {
    it("rejects application when job is closed", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-1",
        userId: "user-tal",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-1",
        status: JobStatus.CLOSED,
      });

      await expect(applyToJob("user-tal", { jobId: "job-1" })).rejects.toThrow(
        "This job is closed and no longer accepting applications.",
      );
    });

    it("rejects duplicate application for the same job", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-1",
        userId: "user-tal",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-1",
        status: JobStatus.ACTIVE,
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue({
        id: "app-1",
        jobId: "job-1",
        talentProfileId: "tal-1",
      });

      await expect(applyToJob("user-tal", { jobId: "job-1" })).rejects.toThrow(
        "You have already submitted an application for this job.",
      );
    });

    it("successfully creates application when criteria are met", async () => {
      (prisma.talentProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "tal-1",
        userId: "user-tal",
      });

      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: "job-1",
        status: JobStatus.ACTIVE,
      });

      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.jobApplication.create as jest.Mock).mockResolvedValue({
        id: "app-1",
        jobId: "job-1",
        talentProfileId: "tal-1",
      });

      const res = await applyToJob("user-tal", {
        jobId: "job-1",
        coverLetter: "Excited to apply!",
      });

      expect(res.id).toBe("app-1");
      expect(prisma.jobApplication.create).toHaveBeenCalled();
    });
  });
});
