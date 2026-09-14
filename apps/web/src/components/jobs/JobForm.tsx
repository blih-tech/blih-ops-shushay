"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Sparkles } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Select,
  FormField,
  Alert,
} from "@blih/ui";
import { SkillsInput } from "@/components/profile/SkillsInput";
import { JobCompensationFields } from "@/components/jobs/JobCompensationFields";
import {
  EmploymentType,
  ExperienceLevel,
  EnglishLevel,
  Job,
} from "@/types/job";
import {
  employmentTypeOptions,
  experienceLevelOptions,
  englishLevelOptions,
} from "@/lib/jobOptions";

export { employmentTypeOptions, experienceLevelOptions, englishLevelOptions };

export interface JobFormData {
  title: string;
  description: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  englishLevel?: EnglishLevel;
  requiredSkills: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryDisplay?: string;
  workingHours?: string;
  timezone?: string;
  countryRestrictions?: string[];
  applicationDeadline?: string;
}

interface JobFormProps {
  initialData?: Partial<Job>;
  onSubmit: (data: JobFormData) => Promise<void>;
  submitLabel: string;
  loadingLabel: string;
  isSubmitting: boolean;
  error: string | null;
  subscriptionRequired?: boolean;
}

export function JobForm({
  initialData,
  onSubmit,
  submitLabel,
  loadingLabel,
  isSubmitting,
  error,
  subscriptionRequired,
}: JobFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialData?.employmentType || "FULL_TIME",
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialData?.experienceLevel || "MID",
  );
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel | "">(
    initialData?.englishLevel || "PROFESSIONAL",
  );
  const [skills, setSkills] = useState<string[]>(
    initialData?.requiredSkills || [],
  );
  const [salaryMin, setSalaryMin] = useState<string>(
    initialData?.salaryMin ? String(initialData.salaryMin) : "",
  );
  const [salaryMax, setSalaryMax] = useState<string>(
    initialData?.salaryMax ? String(initialData.salaryMax) : "",
  );
  const [salaryCurrency, setSalaryCurrency] = useState(
    initialData?.salaryCurrency || "USD",
  );
  const [workingHours, setWorkingHours] = useState(
    initialData?.workingHours || "",
  );
  const [timezone, setTimezone] = useState(initialData?.timezone || "");
  const [countryRestrictions, setCountryRestrictions] = useState(
    Array.isArray(initialData?.countryRestrictions)
      ? initialData.countryRestrictions.join(", ")
      : "",
  );
  const [applicationDeadline, setApplicationDeadline] = useState(
    initialData?.applicationDeadline
      ? new Date(initialData.applicationDeadline).toISOString().split("T")[0]
      : "",
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!title.trim()) {
      setLocalError("Job title is required.");
      return;
    }
    if (description.trim().length < 20) {
      setLocalError("Job description must be at least 20 characters.");
      return;
    }
    if (skills.length === 0) {
      setLocalError("Please add at least one required skill competency.");
      return;
    }

    const countries = countryRestrictions
      ? countryRestrictions
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const payload: JobFormData = {
      title: title.trim(),
      description: description.trim(),
      employmentType,
      experienceLevel,
      englishLevel: (englishLevel as EnglishLevel) || undefined,
      requiredSkills: skills,
      salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
      salaryCurrency: salaryCurrency.trim() || "USD",
      workingHours: workingHours.trim() || undefined,
      timezone: timezone.trim() || undefined,
      countryRestrictions: countries.length > 0 ? countries : undefined,
      applicationDeadline: applicationDeadline
        ? new Date(applicationDeadline).toISOString()
        : undefined,
    };

    await onSubmit(payload);
  };

  const activeError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans">
      {activeError && (
        <Alert variant="error" title="Form Submission Error">
          {activeError}
        </Alert>
      )}

      {subscriptionRequired && (
        <Card className="border border-[#1E5BFF]/30 bg-gradient-to-br from-white to-[#EEF3FF] rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#17131F]">
            Active Subscription Required
          </h2>
          <p className="text-sm text-[#6E6678] max-w-md mx-auto">
            Publishing new opportunities requires an active company membership.
          </p>
          <Link href="/company/subscription" className="inline-block pt-2">
            <Button variant="primary" size="md">
              Activate Subscription
            </Button>
          </Link>
        </Card>
      )}

      {/* Basic Role Information Card */}
      <Card className="border border-[#D9CEDF] rounded-3xl shadow-[0_4px_20px_rgba(23,19,31,0.03)] p-0 overflow-visible bg-white">
        <CardHeader className="bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF] p-6 sm:p-8 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[#17131F] font-display">
                Basic Role Information
              </CardTitle>
              <CardDescription className="text-sm text-[#6E6678] font-sans">
                Core position title, working requirements, and responsibilities.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6 bg-white rounded-b-3xl">
          <FormField label="Job Title" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              fullWidth
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Job Description" required>
            <Textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail role objectives, core responsibilities, team structure, and expectations..."
              fullWidth
              maxLength={3000}
              showCharCount
              disabled={isSubmitting}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FormField label="Employment Type" required>
              <Select
                options={employmentTypeOptions}
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(e.target.value as EmploymentType)
                }
                placeholder="Select type"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Experience Level" required>
              <Select
                options={experienceLevelOptions}
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(e.target.value as ExperienceLevel)
                }
                placeholder="Select level"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="English Proficiency">
              <Select
                options={englishLevelOptions}
                value={englishLevel}
                onChange={(e) =>
                  setEnglishLevel(e.target.value as EnglishLevel | "")
                }
                placeholder="Select proficiency"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <SkillsInput
            value={skills}
            onChange={setSkills}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Compensation & Logistics Card */}
      <JobCompensationFields
        salaryMin={salaryMin}
        setSalaryMin={setSalaryMin}
        salaryMax={salaryMax}
        setSalaryMax={setSalaryMax}
        salaryCurrency={salaryCurrency}
        setSalaryCurrency={setSalaryCurrency}
        workingHours={workingHours}
        setWorkingHours={setWorkingHours}
        timezone={timezone}
        setTimezone={setTimezone}
        applicationDeadline={applicationDeadline}
        setApplicationDeadline={setApplicationDeadline}
        disabled={isSubmitting}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Link href="/company/jobs">
          <Button
            variant="outline"
            size="lg"
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? loadingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
