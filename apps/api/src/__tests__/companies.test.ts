import {
  getOrCreateProfile,
  updateProfile,
  getCompanyById,
} from "../modules/companies/company.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
  companyProfile: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

describe("Company Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrCreateProfile", () => {
    it("returns existing profile if present", async () => {
      const mockProfile = {
        id: "comp-1",
        userId: "user-1",
        companyName: "Acme Inc",
      };
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);

      const res = await getOrCreateProfile("user-1");
      expect(res).toEqual(mockProfile);
      expect(prisma.companyProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
    });

    it("creates a profile if none exists", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue(null);
      const newProfile = {
        id: "comp-new",
        userId: "user-2",
        companyName: null,
      };
      (prisma.companyProfile.create as jest.Mock).mockResolvedValue(newProfile);

      const res = await getOrCreateProfile("user-2");
      expect(res).toEqual(newProfile);
      expect(prisma.companyProfile.create).toHaveBeenCalledWith({
        data: { userId: "user-2" },
      });
    });
  });

  describe("updateProfile", () => {
    it("updates company profile fields", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue({
        id: "comp-1",
        userId: "user-1",
      });
      const updatedProfile = {
        id: "comp-1",
        userId: "user-1",
        companyName: "Acme Global",
        website: "https://acme.example.com",
      };
      (prisma.companyProfile.update as jest.Mock).mockResolvedValue(updatedProfile);

      const res = await updateProfile("user-1", {
        companyName: "Acme Global",
        website: "https://acme.example.com",
      });

      expect(res).toEqual(updatedProfile);
    });

    it("throws 404 if profile does not exist", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        updateProfile("non-existent", { companyName: "Test" }),
      ).rejects.toThrow("Company profile not found");
    });
  });

  describe("getCompanyById", () => {
    it("returns public company profile and active jobs", async () => {
      const mockCompany = {
        id: "comp-123",
        companyName: "TechCorp",
        description: "Leading software engineering company",
        website: "https://techcorp.io",
        country: "Germany",
        city: "Berlin",
        logoUrl: "https://cloudinary.com/logo.png",
        jobs: [
          {
            id: "job-1",
            title: "Senior Frontend Engineer",
            status: "ACTIVE",
          },
        ],
      };
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue(mockCompany);

      const result = await getCompanyById("comp-123");
      expect(result).toEqual(mockCompany);
      expect(prisma.companyProfile.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "comp-123" },
        }),
      );
    });

    it("throws 404 when company is not found", async () => {
      (prisma.companyProfile.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getCompanyById("invalid-id")).rejects.toThrow(
        "Company profile not found",
      );
    });
  });
});
