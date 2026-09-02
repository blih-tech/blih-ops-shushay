"use client";

import React, { useEffect, useRef } from "react";
import { Badge, SkillBar } from "@blih/ui";
import { Award } from "lucide-react";

export function LandingProfileMockup() {
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const badge = badgeRef.current;
    if (!card) return;

    // Start hidden — will animate in on scroll
    card.style.opacity = "0";
    card.style.transform = "translateY(40px) scale(0.97)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // 1. Card slides up and fades in
        card.style.transition =
          "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0px) scale(1)";

        // 2. Skill bar rows stagger in from left
        const bars = card.querySelectorAll<HTMLElement>(".skill-bar-row");
        bars.forEach((bar, i) => {
          bar.style.opacity = "0";
          bar.style.transform = "translateX(-14px)";
          setTimeout(() => {
            bar.style.transition =
              "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
            bar.style.opacity = "1";
            bar.style.transform = "translateX(0)";
          }, 420 + i * 130);
        });

        // 3. Stat tiles bounce in
        const stats = card.querySelectorAll<HTMLElement>(".stat-tile");
        stats.forEach((s, i) => {
          s.style.opacity = "0";
          s.style.transform = "scale(0.75)";
          setTimeout(() => {
            s.style.transition =
              "opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
            s.style.opacity = "1";
            s.style.transform = "scale(1)";
          }, 700 + i * 90);
        });

        // 4. Floating badge springs in last
        if (badge) {
          badge.style.opacity = "0";
          badge.style.transform = "scale(0.55) translateY(10px)";
          setTimeout(() => {
            badge.style.transition =
              "opacity 0.5s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)";
            badge.style.opacity = "1";
            badge.style.transform = "scale(1) translateY(0)";
          }, 980);
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white border border-[#D9CEDF] rounded-md p-6 sm:p-8 shadow-[0_20px_60px_rgba(23,19,31,0.08)] relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-[#D9CEDF]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-2xl font-bold text-[#17131F]">
              Mikeal Tadesse
            </h3>
            <Badge variant="verified" size="sm">
              Verified Profile
            </Badge>
          </div>
          <p className="font-mono text-xs text-[#1E5BFF]">
            Frontend Engineer · Next.js Specialist
          </p>
        </div>
        {/* Avatar initials */}
        <div className="w-12 h-12 rounded-lg bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] font-display font-bold text-lg">
          MT
        </div>
      </div>

      {/* Skill bars — each wrapped so they can animate independently */}
      <div className="py-6 space-y-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E6678] block mb-2">
          Evidence-Backed Capabilities
        </span>
        <div className="skill-bar-row">
          <SkillBar
            name="React Product Systems"
            score={94}
            status="Verified"
            variant="primary"
          />
        </div>
        <div className="skill-bar-row">
          <SkillBar
            name="TypeScript Architecture"
            score={89}
            status="Verified"
            variant="primary"
          />
        </div>
        <div className="skill-bar-row">
          <SkillBar
            name="Accessibility & UI Design"
            score={82}
            status="Developing"
            variant="coral"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D9CEDF]/60">
        <div className="stat-tile bg-[#EEF3FF] rounded-lg p-3 text-center">
          <span className="font-display text-xl font-bold text-[#1E5BFF] block">
            4
          </span>
          <span className="font-mono text-[10px] text-[#6E6678]">
            Assessments
          </span>
        </div>
        <div className="stat-tile bg-[#EEF3FF] rounded-lg p-3 text-center">
          <span className="font-display text-xl font-bold text-[#1E5BFF] block">
            12
          </span>
          <span className="font-mono text-[10px] text-[#6E6678]">Projects</span>
        </div>
        <div className="stat-tile bg-[#EEF3FF] rounded-lg p-3 text-center">
          <span className="font-display text-xl font-bold text-[#2E8F79] block">
            100%
          </span>
          <span className="font-mono text-[10px] text-[#6E6678]">
            Proof Score
          </span>
        </div>
      </div>

      {/* Floating badge — springs in after the card */}
      <div
        ref={badgeRef}
        className="hidden sm:flex absolute -bottom-6 -left-6 bg-white border border-[#D9CEDF] rounded-lg p-4 shadow-lg items-center gap-3"
      >
        <div className="w-10 h-10 rounded-md bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="font-sans text-xs font-semibold text-[#17131F]">
            Credential Verified
          </p>
          <p className="font-mono text-[10px] text-[#6E6678]">
            Mikeal · Direct proof attached
          </p>
        </div>
      </div>
    </div>
  );
}
