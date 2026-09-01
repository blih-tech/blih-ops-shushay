"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function EcosystemCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initial staggered reveal of evidence floats when section enters viewport
      gsap.fromTo(
        ".evidence-float",
        { opacity: 0, scale: 0.7, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.4)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Staggered fill animation for skills triggered on scroll
      gsap.fromTo(
        ".profile-progress-fill",
        { width: 0 },
        {
          width: (i, el: any) => el.dataset.width,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Continuous floating motion loop
      gsap.to(".evidence-float", {
        y: -6,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
        stagger: {
          each: 0.3,
          from: "start",
        },
      });
    },
    { scope: containerRef },
  );

  const onCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: "-=8",
      scale: 1.03,
      boxShadow: "0 20px 35px rgba(30,91,255,0.08)",
      borderColor: "#1E5BFF",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      borderColor: "#D9CEDF",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 space-y-12 relative overflow-hidden select-none font-sans"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#DDE7FF]/20 to-transparent pointer-events-none -z-10" />

      {/* Header and intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        <div className="space-y-3 lg:col-span-8">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold block">
            ONE PROFILE, CONTINUOUS GROWTH
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17131F] leading-tight">
            Evidence becomes
            <br />
            professional identity.
          </h2>
        </div>
        <div className="lg:col-span-4 lg:pt-6">
          <p className="font-sans text-base text-[#6E6678] leading-relaxed">
            Learning, assessments, real projects and reviews strengthen one
            Skill Profile instead of living in separate places.
          </p>
        </div>
      </div>

      {/* Evolution interactive/visual section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4 relative min-h-[500px]">
        {/* Left Side: Floating evidence objects (First group) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Course completed */}
          <div
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="evidence-float bg-[#EEF3FF] border border-[#D9CEDF] rounded-[22px] px-6 py-4 shadow-sm"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-base font-bold text-[#17131F] mb-1">
              Course completed
            </h4>
            <span className="font-mono text-[9px] text-[#6E6678] uppercase tracking-wider">
              learning evidence
            </span>
          </div>

          {/* Assessment passed */}
          <div
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="evidence-float bg-[#DDE7FF] border border-[#D9CEDF] rounded-[22px] px-6 py-4 shadow-sm"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-base font-bold text-[#17131F] mb-1">
              Assessment passed
            </h4>
            <span className="font-mono text-[9px] text-[#6E6678] uppercase tracking-wider">
              learning evidence
            </span>
          </div>

          {/* React skill verified */}
          <div
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="evidence-float bg-[#DDE7FF] border-2 border-[#1E5BFF] rounded-[22px] px-6 py-4 shadow-md"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-base font-bold text-[#1E5BFF] mb-1">
              React skill verified
            </h4>
            <span className="font-mono text-[9px] text-[#6E6678] uppercase tracking-wider">
              skill proof
            </span>
          </div>
        </div>

        {/* Center: Mikael evolving Skill Profile Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[470px] bg-white border border-[#D9CEDF] rounded-[34px] p-8 shadow-[0_28px_58px_rgba(23,19,31,0.08)] space-y-8 relative">
            {/* User Profile Header */}
            <div className="flex items-center gap-4">
              <div className="w-[76px] h-[76px] rounded-full bg-[#DDE7FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] font-display font-bold text-2xl">
                MA
              </div>
              <div className="space-y-0.5">
                <h3 className="font-display text-[34px] font-bold text-[#17131F] leading-none">
                  Mikael Abebe
                </h3>
                <span className="font-mono text-xs text-[#1E5BFF] uppercase tracking-wider block font-semibold">
                  Frontend Engineer
                </span>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="space-y-6">
              {/* React */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#17131F] w-[100px] shrink-0">
                  React
                </span>
                <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                  <div
                    className="bg-[#1E5BFF] h-full rounded-full profile-progress-fill"
                    data-width="89.5%"
                  />
                </div>
                <div className="w-[70px] text-right leading-tight font-mono text-[10px] text-[#1E5BFF]">
                  <span className="font-display text-base font-bold block">
                    94
                  </span>
                  <span>Verified</span>
                </div>
              </div>

              {/* TypeScript */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#17131F] w-[100px] shrink-0">
                  TypeScript
                </span>
                <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                  <div
                    className="bg-[#1E5BFF] h-full rounded-full profile-progress-fill"
                    data-width="84.7%"
                  />
                </div>
                <div className="w-[70px] text-right leading-tight font-mono text-[10px] text-[#1E5BFF]">
                  <span className="font-display text-base font-bold block">
                    89
                  </span>
                  <span>Verified</span>
                </div>
              </div>

              {/* Accessibility */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#17131F] w-[100px] shrink-0">
                  Accessibility
                </span>
                <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                  <div
                    className="bg-[#FF8A5B] h-full rounded-full profile-progress-fill"
                    data-width="78%"
                  />
                </div>
                <div className="w-[70px] text-right leading-tight font-mono text-[10px] text-[#6E6678]">
                  <span className="font-display text-base font-bold block">
                    82
                  </span>
                  <span>Developing</span>
                </div>
              </div>
            </div>

            {/* Evidence Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-6 border-t border-[#D9CEDF]/60">
              <div className="bg-[#DDE7FF] rounded-[18px] p-3 text-center flex flex-col justify-center items-center h-[70px]">
                <span className="font-display text-2xl font-bold text-[#1E5BFF] block leading-none">
                  4
                </span>
                <span className="font-mono text-[9px] text-[#6E6678] mt-1 leading-tight uppercase font-medium">
                  verified assessments
                </span>
              </div>
              <div className="bg-[#F7F9FF] rounded-[18px] p-3 text-center flex flex-col justify-center items-center h-[70px] border border-[#D9CEDF]/40">
                <span className="font-display text-2xl font-bold text-[#1E5BFF] block leading-none">
                  12
                </span>
                <span className="font-mono text-[9px] text-[#6E6678] mt-1 leading-tight uppercase font-medium">
                  completed projects
                </span>
              </div>
              <div className="bg-[#F7F9FF] rounded-[18px] p-3 text-center flex flex-col justify-center items-center h-[70px] border border-[#D9CEDF]/40">
                <span className="font-display text-2xl font-bold text-[#1E5BFF] block leading-none">
                  17
                </span>
                <span className="font-mono text-[9px] text-[#6E6678] mt-1 leading-tight uppercase font-medium">
                  client reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Floating evidence objects (Second group) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Real project completed */}
          <div
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="evidence-float bg-[#FFF7EF] border border-[#D9CEDF] rounded-[22px] px-6 py-4 shadow-sm"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-base font-bold text-[#17131F] mb-1">
              Real project completed
            </h4>
            <span className="font-mono text-[9px] text-[#6E6678] uppercase tracking-wider">
              skill proof
            </span>
          </div>

          {/* Client review received */}
          <div
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="evidence-float bg-[#EEF3FF] border border-[#D9CEDF] rounded-[22px] px-6 py-4 shadow-sm"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-base font-bold text-[#17131F] mb-1">
              Client review received
            </h4>
            <span className="font-mono text-[9px] text-[#6E6678] uppercase tracking-wider">
              work reputation
            </span>
          </div>

          {/* Reputation increased */}
          <div
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="evidence-float bg-[#DDE7FF] border border-[#D9CEDF] rounded-[22px] px-6 py-4 shadow-sm"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-base font-bold text-[#17131F] mb-1">
              Reputation increased
            </h4>
            <span className="font-mono text-[9px] text-[#6E6678] uppercase tracking-wider">
              work reputation
            </span>
          </div>
        </div>
      </div>

      {/* Scroll behavior note */}
      <div className="text-center pt-6 relative z-10">
        <span className="font-mono text-[11px] text-[#6E6678] bg-[#EEF3FF] border border-[#D9CEDF]/60 rounded-full px-4 py-1.5 inline-block uppercase tracking-wider">
          Scroll behavior: evidence objects move into the profile and become
          skill confidence, verified proof and reputation.
        </span>
      </div>
    </div>
  );
}
