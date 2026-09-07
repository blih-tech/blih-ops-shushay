"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button, Badge } from "@blih/ui";
import { Job } from "@/types/job";

interface JobPreviewDetailProps {
  job: Job | null;
  formatSalary: (job: Job) => string;
  formatLocation: (job: Job) => string;
}

export function JobPreviewDetail({
  job,
  formatSalary,
  formatLocation,
}: JobPreviewDetailProps) {
  if (!job) {
    return (
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 text-center text-[#6E6678] text-sm">
        Select a position to view its details.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-5 sm:p-8 shadow-[0_12px_48px_rgba(30,91,255,0.06)] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D9CEDF]/70">
        <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
          Opportunity Details
        </span>
        <Badge variant="primary" size="md">
          {job.experienceLevel} Level
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-[#17131F]">
            {job.title}
          </h2>
          {job.hasApplied && (
            <Badge variant="verified" size="sm">
              Applied
            </Badge>
          )}
        </div>
        <p className="font-sans text-sm font-semibold text-[#1E5BFF]">
          {job.companyProfile?.companyName || "Company"} · {formatLocation(job)}
        </p>
        <p className="font-mono text-xs font-bold text-[#2E8F79]">
          {formatSalary(job)}
        </p>
      </div>

      <div className="space-y-2 text-sm text-[#6E6678] font-sans leading-relaxed">
        <p className="line-clamp-4">{job.description}</p>
      </div>

      {/* Skills */}
      {job.requiredSkills.length > 0 && (
        <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-2xl p-5 space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#17131F] font-bold block">
            Required Competencies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-xl bg-white border border-[#1E5BFF]/20 text-xs font-mono text-[#1E5BFF] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 space-y-3">
        <Link href={`/jobs/${job.id}`} className="block">
          {job.hasApplied ? (
            <Button
              size="lg"
              fullWidth
              variant="outline"
              className="bg-[#E6F5F0] text-[#2E8F79] border-[#2E8F79]/30 font-semibold"
              leftIcon={<CheckCircle2 className="w-4 h-4 text-[#2E8F79]" />}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Applied · View Details
            </Button>
          ) : (
            <Button
              size="lg"
              fullWidth
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              View Role & Apply
            </Button>
          )}
        </Link>
        <p className="text-center font-mono text-[11px] text-[#6E6678]">
          {job.hasApplied
            ? "Your application is submitted. Click to view full listing details."
            : "Review full requirements and submit your application with verified credentials."}
        </p>
      </div>
    </div>
  );
}
