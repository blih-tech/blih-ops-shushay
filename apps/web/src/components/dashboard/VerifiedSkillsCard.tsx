"use client";

import React, { useRef } from "react";
import { Badge } from "@blih/ui";
import { ShieldCheck, Award } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface VerifiedSkillsCardProps {
  totalCompleted: number;
  skills?: string[];
  isComplete?: boolean;
}

export function VerifiedSkillsCard({
  totalCompleted,
  skills = [],
  isComplete = false,
}: VerifiedSkillsCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".verified-score-stat",
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.6)",
          delay: 0.1,
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="lg:col-span-4 bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between font-sans"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-[#17131F] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2E8F79]" /> Verified Signal
          </h3>
          <Badge variant={isComplete ? "verified" : "amber"} size="sm">
            {isComplete ? "Completed Profile" : "In Progress"}
          </Badge>
        </div>
        <p className="font-sans text-xs text-[#6E6678]">
          Real-time course tracks and profile capability status.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-t border-[#D9CEDF]/50 pt-4">
          <span className="verified-score-stat font-display text-3xl font-bold text-[#1E5BFF]">
            {totalCompleted} Track{totalCompleted === 1 ? "" : "s"} Earned
          </span>
          <span className="font-sans text-xs text-[#2E8F79] font-medium flex items-center gap-1">
            <Award className="w-4 h-4" /> Credentials
          </span>
        </div>

        {skills && skills.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-mono text-[#6E6678] uppercase font-semibold">
              Top Profile Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="primary" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#6E6678] italic">
            Complete your profile or learning courses to show verified skill tags.
          </p>
        )}
      </div>
    </div>
  );
}
