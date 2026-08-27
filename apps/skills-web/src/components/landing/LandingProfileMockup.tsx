"use client";

import React from "react";
import { Badge, SkillBar } from "@/components/ui";
import { Award } from "lucide-react";

export function LandingProfileMockup() {
  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(23,19,31,0.08)] relative">
      <div className="flex items-start justify-between pb-6 border-b border-[#D9CEDF]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-2xl font-bold text-[#17131F]">
              Sara Tesfaye
            </h3>
            <Badge variant="verified" size="sm">
              Verified Profile
            </Badge>
          </div>
          <p className="font-mono text-xs text-[#1E5BFF]">
            Frontend Engineer · Next.js Specialist
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] font-display font-bold text-lg">
          ST
        </div>
      </div>

      <div className="py-6 space-y-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E6678] block mb-2">
          Evidence-Backed Capabilities
        </span>
        <SkillBar
          name="React Product Systems"
          score={94}
          status="Verified"
          variant="primary"
        />
        <SkillBar
          name="TypeScript Architecture"
          score={89}
          status="Verified"
          variant="primary"
        />
        <SkillBar
          name="Accessibility & UI Design"
          score={82}
          status="Developing"
          variant="coral"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D9CEDF]/60">
        <div className="bg-[#EEF3FF] rounded-2xl p-3 text-center">
          <span className="font-display text-xl font-bold text-[#1E5BFF] block">
            4
          </span>
          <span className="font-mono text-[10px] text-[#6E6678]">
            Assessments
          </span>
        </div>
        <div className="bg-[#EEF3FF] rounded-2xl p-3 text-center">
          <span className="font-display text-xl font-bold text-[#1E5BFF] block">
            12
          </span>
          <span className="font-mono text-[10px] text-[#6E6678]">
            Projects
          </span>
        </div>
        <div className="bg-[#EEF3FF] rounded-2xl p-3 text-center">
          <span className="font-display text-xl font-bold text-[#2E8F79] block">
            100%
          </span>
          <span className="font-mono text-[10px] text-[#6E6678]">
            Proof Score
          </span>
        </div>
      </div>

      <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white border border-[#D9CEDF] rounded-2xl p-4 shadow-lg items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="font-sans text-xs font-semibold text-[#17131F]">
            Credential Verified
          </p>
          <p className="font-mono text-[10px] text-[#6E6678]">
            Direct proof attached to profile
          </p>
        </div>
      </div>
    </div>
  );
}
