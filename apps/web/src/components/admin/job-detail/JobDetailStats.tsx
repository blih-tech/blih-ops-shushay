"use client";

import React from "react";
import { Users, Briefcase, Calendar, CreditCard } from "lucide-react";
import type { AdminJobDetail } from "@/types/admin";

interface JobDetailStatsProps {
  job: AdminJobDetail;
}

export function JobDetailStats({ job }: JobDetailStatsProps) {
  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const salaryDisplay =
    job.salaryDisplay ||
    (job.salaryMin
      ? `${job.salaryCurrency} ${job.salaryMin}${job.salaryMax ? `–${job.salaryMax}` : "+"}`
      : "Not Disclosed");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Applications
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {job.applications.length}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Candidate submissions
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Experience Level
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {formatType(job.experienceLevel)}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Role seniority tier
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Deadline
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {job.applicationDeadline
              ? new Date(job.applicationDeadline).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "No Deadline"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Application cutoff
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Compensation
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F] truncate">
            {salaryDisplay}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Estimated salary range
          </div>
        </div>
      </div>
    </div>
  );
}
