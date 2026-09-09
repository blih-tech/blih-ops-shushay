"use client";

import React, { useRef } from "react";
import { SkillBar } from "@blih/ui";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface VerifiedSkillsCardProps {
  totalCompleted: number;
}

export function VerifiedSkillsCard({
  totalCompleted,
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
        <h3 className="font-display font-bold text-lg text-[#17131F]">
          Verified Skills Signal
        </h3>
        <p className="font-sans text-xs text-[#6E6678]">
          Real-time assessment scores and completed track badges.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="verified-score-stat font-display text-4xl font-bold text-[#1E5BFF]">
            +{totalCompleted * 10 || 14}%
          </span>
          <span className="font-sans text-xs text-[#2E8F79] font-medium">
            Boost in Opportunity Match
          </span>
        </div>
        <SkillBar
          name="React & Python Systems"
          score={totalCompleted > 0 ? 100 : 65}
          status={totalCompleted > 0 ? "Verified Track" : "In Progress"}
          variant="primary"
        />
      </div>
    </div>
  );
}
