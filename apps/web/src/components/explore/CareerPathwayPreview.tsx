"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function CareerPathwayPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate readiness progress bar when scrolled into view
      gsap.fromTo(
        ".readiness-progress",
        { width: 0 },
        {
          width: "68%",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Staggered entry of cards when scrolled into view
      gsap.fromTo(
        ".pathway-card",
        { opacity: 0, scale: 0.8, y: 35 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.2)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef },
  );

  const onCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(30,91,255,0.08)",
      borderColor: "#1E5BFF",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const isDark = e.currentTarget.classList.contains("bg-[#17131F]");
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      borderColor: isDark ? "#17131F" : "#E4E8F2",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div ref={containerRef} className="w-full select-none font-sans py-4">
      {/* Full-Height Double-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Eyebrow + Title + Description + Readiness Summary */}
        <div className="lg:col-span-5 space-y-12 flex flex-col">
          {/* Eyebrow, Title & Intro on Left */}
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold block">
              CAREER PATHWAY EXPERIENCE
            </span>
            <h2 className="font-display text-4xl sm:text-[44px] font-bold tracking-tight text-[#17131F] leading-tight">
              Learning paths that
              <br />
              unlock opportunities.
            </h2>
            <p className="font-sans text-base text-[#6E6678] leading-relaxed max-w-xl pt-1">
              A BLIH OPS pathway is not a syllabus. It turns learning into
              practice, practice into proof, and proof into matching roles.
            </p>
          </div>

          {/* Integrated readiness summary */}
          <div className="bg-white border border-[#D9CEDF] rounded-xl p-6 space-y-6 shadow-xs mt-12">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#1E5BFF] uppercase tracking-wider block font-semibold">
                Frontend Engineer Readiness — 68%
              </span>
              <div className="w-full bg-[#DDE7FF] h-2.5 rounded-full overflow-hidden">
                <div
                  className="readiness-progress bg-[#1E5BFF] h-full rounded-full"
                  style={{ width: 0 }}
                />
              </div>
            </div>

            <div className="space-y-5 pt-4 border-t border-[#D9CEDF]/40">
              {/* Strong */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#6E6678] uppercase tracking-wider font-semibold block">
                  Strong in
                </span>
                <span className="text-sm font-semibold text-[#17131F] block">
                  HTML & CSS · JavaScript
                </span>
              </div>

              {/* Developing */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#6E6678] uppercase tracking-wider font-semibold block">
                  Developing
                </span>
                <span className="text-sm font-semibold text-[#1E5BFF] block">
                  React
                </span>
              </div>

              {/* Needs proof */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#6E6678] uppercase tracking-wider font-semibold block">
                  Needs proof
                </span>
                <span className="text-sm font-semibold text-[#17131F] block">
                  Testing · Accessibility
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Immersive pathway product surface */}
        <div className="lg:col-span-7 bg-white border border-[#E4E8F2] rounded-xl p-6 sm:p-8 shadow-xs space-y-8 flex flex-col justify-between h-full">
          <div>
            {/* Surface Header */}
            <div className="border-b border-[#E4E8F2] pb-6 mb-8">
              <h3 className="font-display text-3xl sm:text-[44px] font-bold text-[#17131F] leading-tight">
                Frontend Engineer
              </h3>
              <span className="font-mono text-xs text-[#6E6678] uppercase tracking-wider mt-1 block">
                learn → build → prove → unlock work
              </span>
            </div>

            {/* Interactive grid elements matching coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {/* Foundation Phase completed block */}
              <div
                onMouseEnter={onCardEnter}
                onMouseLeave={onCardLeave}
                className="pathway-card bg-[#F7F9FF] border border-[#D9CEDF]/40 rounded-xl p-5 flex flex-col justify-between h-[210px]"
                style={{ opacity: 0 }}
              >
                <h4 className="font-display text-2xl font-bold text-[#17131F]">
                  Foundation
                </h4>
                <div className="space-y-2">
                  <div className="bg-white rounded-md px-4 py-2 border border-[#D9CEDF]/30 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#17131F]">
                      HTML & CSS
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1E5BFF]">
                      ✓
                    </span>
                  </div>
                  <div className="bg-white rounded-md px-4 py-2 border border-[#D9CEDF]/30 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#17131F]">
                      JavaScript
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1E5BFF]">
                      ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Build Phase active project */}
              <div
                onMouseEnter={onCardEnter}
                onMouseLeave={onCardLeave}
                className="pathway-card bg-white border-2 border-[#D9CEDF] rounded-xl p-5 flex flex-col justify-between h-[300px] md:row-span-2"
                style={{ opacity: 0 }}
              >
                <div>
                  <h4 className="font-display text-3xl font-bold text-[#1E5BFF]">
                    Build
                  </h4>
                  <span className="font-mono text-[10px] text-[#6E6678] uppercase tracking-wider font-semibold block mt-1">
                    React — Developing
                  </span>
                  {/* Real project editor visual mockup */}
                  <div className="bg-[#F7F9FF] border border-[#DDE7FF] rounded-md p-3.5 mt-4 space-y-2.5">
                    <div className="h-2 w-28 bg-[#BFD0FF] rounded-full" />
                    <div className="h-3 w-20 bg-[#1E5BFF] rounded-full" />
                    <div className="h-2 w-24 bg-[#DDE7FF] rounded-full" />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="font-mono text-xs text-[#1E5BFF] font-bold">
                    Continue Project →
                  </span>
                  <span className="font-display text-3xl font-bold text-[#1E5BFF] leading-none">
                    72%
                  </span>
                </div>
              </div>

              {/* Prove Phase checkpoint */}
              <div
                onMouseEnter={onCardEnter}
                onMouseLeave={onCardLeave}
                className="pathway-card bg-[#17131F] text-white rounded-xl p-[22px] flex flex-col justify-between h-[255px] md:row-span-2 border border-[#17131F]"
                style={{ opacity: 0 }}
              >
                <div>
                  <h4 className="font-display text-2xl font-bold text-left">
                    Prove
                  </h4>
                  <div className="flex items-center justify-center my-5">
                    {/* Timer circle matching specifications */}
                    <div className="w-[82px] h-[82px] rounded-full bg-white flex items-center justify-center border-[7px] border-[#1E5BFF] shadow-sm">
                      <span className="font-display text-2xl font-bold text-[#1E5BFF]">
                        15m
                      </span>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] text-[#DDE7FF] text-left uppercase tracking-wider leading-snug">
                    Skill Checkpoint
                    <br />
                    React Verified
                  </p>
                </div>
                <div className="pt-2 text-left">
                  <span className="font-mono text-[10px] font-bold uppercase text-white tracking-wider cursor-pointer hover:underline">
                    Take Assessment →
                  </span>
                </div>
              </div>

              {/* Skill proof evidence transform */}
              <div
                onMouseEnter={onCardEnter}
                onMouseLeave={onCardLeave}
                className="pathway-card bg-white border border-[#D9CEDF] rounded-xl p-5 flex flex-col justify-between h-[120px]"
                style={{ opacity: 0 }}
              >
                <div>
                  <span className="font-mono text-[10px] text-[#1E5BFF] uppercase tracking-wider font-semibold block">
                    React skill proof
                  </span>
                  <h4 className="font-display text-2xl font-bold text-[#1E5BFF] leading-none mt-1">
                    Verified
                  </h4>
                </div>
                <span className="font-mono text-[10px] text-[#6E6678] font-bold">
                  View Skill Proof
                </span>
              </div>

              {/* Opportunity payoff unlocked */}
              <div
                onMouseEnter={onCardEnter}
                onMouseLeave={onCardLeave}
                className="pathway-card bg-[#DDE7FF]/60 border border-[#D9CEDF]/40 rounded-xl p-5 flex flex-col justify-between h-[150px] md:col-span-2"
                style={{ opacity: 0 }}
              >
                <div>
                  <span className="font-mono text-[10px] text-[#1E5BFF] uppercase tracking-wider font-semibold block">
                    Opportunity unlocked
                  </span>
                  <h4 className="font-display text-2xl font-bold text-[#17131F] mt-1 leading-tight">
                    Junior Frontend Engineer
                  </h4>
                  <p className="font-mono text-[9px] text-[#6E6678] mt-1 tracking-wide">
                    243 matching opportunities · 81% current match
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#1E5BFF] font-bold self-end hover:underline cursor-pointer">
                  Explore Roles
                </span>
              </div>
            </div>
          </div>

          {/* Bottom causal note */}
          <div className="border-t border-[#E4E8F2] pt-4 text-center mt-6">
            <span className="font-mono text-[10px] text-[#6E6678] uppercase tracking-wider">
              The opportunity is unlocked by the proof created through learning
              and project work — no roadmap line required.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
