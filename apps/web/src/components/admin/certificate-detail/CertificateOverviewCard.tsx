"use client";

import React from "react";
import { BookOpen, ShieldCheck, CheckCircle2 } from "lucide-react";

interface CertificateOverviewCardProps {
  cert: any;
}

export function CertificateOverviewCard({
  cert,
}: CertificateOverviewCardProps) {
  const course = cert.course;

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Course & Qualification Details
            </h2>
            <p className="text-xs text-[#6E6678]">
              Completed curriculum requirements and verified skills
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-1.5">
            Course Title
          </div>
          <div className="font-semibold text-base text-[#17131F]">
            {course?.title || "Professional Skill Course"}
          </div>
          {course?.description && (
            <p className="text-sm text-[#4A4453] leading-relaxed mt-2">
              {course.description}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#F4EFF7] space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8]">
            Verification & Accreditation
          </div>
          <div className="p-4 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] space-y-2 text-xs text-[#4A4453]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#2E8F79] shrink-0" />
              <span>Full curriculum lectures and lesson requirements completed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#2E8F79] shrink-0" />
              <span>Identity authenticated with Blih platform credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2E8F79] shrink-0" />
              <span>Digitally signed and cryptographically archived</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
