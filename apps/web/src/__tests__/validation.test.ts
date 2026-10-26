import { describe, it, expect } from "vitest";
import {
  updateTalentProfileSchema,
  createExperienceSchema,
  EnglishLevelEnum,
} from "@blih/validation";

describe("Validation Schemas in Web Application", () => {
  describe("EnglishLevelEnum", () => {
    it("accepts valid English levels", () => {
      expect(EnglishLevelEnum.safeParse("FLUENT").success).toBe(true);
      expect(EnglishLevelEnum.safeParse("NATIVE").success).toBe(true);
      expect(EnglishLevelEnum.safeParse("CONVERSATIONAL").success).toBe(true);
    });

    it("rejects invalid English levels", () => {
      expect(EnglishLevelEnum.safeParse("EXPERT").success).toBe(false);
      expect(EnglishLevelEnum.safeParse("").success).toBe(false);
    });
  });

  describe("updateTalentProfileSchema", () => {
    it("validates a full profile successfully", () => {
      const validProfile = {
        fullName: "Abebe Bikila",
        title: "Senior Full Stack Engineer",
        phone: "+251911223344",
        country: "Ethiopia",
        city: "Addis Ababa",
        englishLevel: "PROFESSIONAL",
        skills: ["TypeScript", "Next.js", "Node.js"],
        bio: "Experienced engineer passionate about fintech.",
      };

      const result = updateTalentProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it("fails when title exceeds 100 characters", () => {
      const invalidProfile = {
        title: "A".repeat(101),
      };

      const result = updateTalentProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it("fails when bio exceeds 500 characters", () => {
      const invalidProfile = {
        bio: "B".repeat(501),
      };

      const result = updateTalentProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });

  describe("createExperienceSchema", () => {
    it("validates required fields and ISO date format", () => {
      const validExperience = {
        title: "Software Engineer",
        company: "Blih Tech",
        startDate: "2023-01-01T00:00:00.000Z",
      };

      const result = createExperienceSchema.safeParse(validExperience);
      expect(result.success).toBe(true);
    });

    it("rejects invalid date format", () => {
      const invalidExperience = {
        title: "Software Engineer",
        company: "Blih Tech",
        startDate: "01/01/2023",
      };

      const result = createExperienceSchema.safeParse(invalidExperience);
      expect(result.success).toBe(false);
    });
  });
});
