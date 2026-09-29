"use client";

import React from "react";
import { Briefcase, Clock, Languages, Award } from "lucide-react";

interface TalentDetailStatsProps {
  talent: any;
}

export function TalentDetailStats({ talent }: TalentDetailStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Applications
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {talent._count?.jobApplications ?? 0}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Active candidate submissions
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Work Experience
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {talent.experience?.length ?? 0}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            {talent.experience?.length === 1 ? "Role logged" : "Roles logged"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            English Level
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <Languages className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {talent.englishLevel || "Not Set"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Self-reported proficiency
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Skills Listed
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {talent.skills?.length ?? 0}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Verified competencies
          </div>
        </div>
      </div>
    </div>
  );
}
