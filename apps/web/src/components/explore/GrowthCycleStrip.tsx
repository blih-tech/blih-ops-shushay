"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function GrowthCycleStrip() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cycle-card",
        { opacity: 0, y: 35, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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
      y: -6,
      borderColor: "#1E5BFF",
      boxShadow: "0 14px 28px rgba(30,91,255,0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: "#D9CEDF",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className="bg-white border border-[#D9CEDF] rounded-xl p-8 sm:p-12 select-none font-sans"
    >
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="font-mono text-xs text-[#1E5BFF] uppercase tracking-wider font-semibold">
          The Continuous Growth Cycle
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
          How abilities turn into opportunities
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          className="cycle-card bg-white border border-[#D9CEDF] rounded-lg p-6 space-y-3 shadow-sm cursor-default"
          style={{ opacity: 0 }}
        >
          <div className="w-10 h-10 rounded-md bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs flex items-center justify-center font-mono font-bold text-sm">
            01
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Learn
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Master practical modern stacks with industry-calibrated courses and
            coding exercises.
          </p>
        </div>

        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          className="cycle-card bg-white border border-[#D9CEDF] rounded-lg p-6 space-y-3 shadow-sm cursor-default"
          style={{ opacity: 0 }}
        >
          <div className="w-10 h-10 rounded-md bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs flex items-center justify-center font-mono font-bold text-sm">
            02
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Practice
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Build real application briefs with test suites, architectural
            decisions, and portfolio work.
          </p>
        </div>

        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          className="cycle-card bg-white border border-[#D9CEDF] rounded-lg p-6 space-y-3 shadow-sm cursor-default"
          style={{ opacity: 0 }}
        >
          <div className="w-10 h-10 rounded-md bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs flex items-center justify-center font-mono font-bold text-sm">
            03
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Prove
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Take rigorous skill assessments and generate verifiable digital
            certificates with score records.
          </p>
        </div>

        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          className="cycle-card bg-white border border-[#D9CEDF] rounded-lg p-6 space-y-3 shadow-sm cursor-default"
          style={{ opacity: 0 }}
        >
          <div className="w-10 h-10 rounded-md bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs flex items-center justify-center font-mono font-bold text-sm">
            04
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Get Hired
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Match automatically with companies hiring for proven capabilities on
            Blih Talent.
          </p>
        </div>
      </div>
    </div>
  );
}
