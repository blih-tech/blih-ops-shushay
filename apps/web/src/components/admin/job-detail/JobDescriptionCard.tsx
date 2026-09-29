"use client";

import React from "react";
import { FileText, Award, Globe } from "lucide-react";
import type { AdminJobDetail } from "@/types/admin";

interface JobDescriptionCardProps {
  job: AdminJobDetail;
}

export function JobDescriptionCard({ job }: JobDescriptionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Role Overview & Requirements
            </h2>
            <p className="text-xs text-[#6E6678]">
              Scope of responsibilities and target qualifications
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-2">
            Job Description
          </div>
          <p className="text-sm text-[#4A4453] leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="pt-4 border-t border-[#F4EFF7]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-2.5">
              <Award className="h-3.5 w-3.5 text-[#6E6678]" />
              Required Skills ({job.requiredSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F0EEF8] text-[#5A506B] border border-[#E2DCED]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Country Restrictions */}
        {job.countryRestrictions && job.countryRestrictions.length > 0 && (
          <div className="pt-4 border-t border-[#F4EFF7]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-2.5">
              <Globe className="h-3.5 w-3.5 text-[#6E6678]" />
              Eligible Countries / Restrictions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.countryRestrictions.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F9F8FC] text-[#6E6678] border border-[#EBE5F0]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
