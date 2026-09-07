import { SelectOption } from "@blih/ui";

export const employmentTypeOptions: SelectOption[] = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Internship" },
];

export const experienceLevelOptions: SelectOption[] = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "MID", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "EXECUTIVE", label: "Executive" },
];

export const englishLevelOptions: SelectOption[] = [
  { value: "", label: "No Requirement" },
  { value: "BASIC", label: "Basic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
];

export function formatSalary(job: {
  salaryDisplay?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
}): string {
  if (job.salaryDisplay) return job.salaryDisplay;
  if (job.salaryMin && job.salaryMax) {
    return `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()} ${job.salaryCurrency || "USD"}`;
  }
  if (job.salaryMin) {
    return `From $${job.salaryMin.toLocaleString()} ${job.salaryCurrency || "USD"}`;
  }
  return "Competitive";
}
