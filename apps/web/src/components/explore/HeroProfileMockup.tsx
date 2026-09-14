"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function HeroProfileMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initial staggered entry animation for the lifecycle badges
      gsap.fromTo(
        ".floating-badge-container",
        { opacity: 0, scale: 0.3, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.5)",
          stagger: 0.1,
          delay: 0.3,
        },
      );

      // Continuous gentle floating overlay loop (starts after reveal)
      gsap.to(".floating-badge-container", {
        y: -6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
        stagger: {
          each: 0.3,
          from: "random",
        },
      });

      // Initial scale/fade reveal of the profile surface
      gsap.fromTo(
        ".profile-card",
        { scale: 0.9, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.2)",
          delay: 0.2,
        },
      );

      // Staggered loading of progress bars
      gsap.fromTo(
        ".progress-fill",
        { width: 0 },
        {
          width: (i, el: any) => el.dataset.width,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.8,
          stagger: 0.15,
        },
      );
    },
    { scope: containerRef },
  );

  // Creative Magnetic Hover Interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(e.currentTarget, {
      x: x * 0.1,
      y: y * 0.1,
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(30,91,255,0.18)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const isPrimary = e.currentTarget.classList.contains("bg-[#1E5BFF]");
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      scale: 1,
      boxShadow: isPrimary
        ? "0 12px 24px rgba(30,91,255,0.3)"
        : "0 4px 12px rgba(23,19,31,0.05)",
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[520px] h-[580px] sm:h-[620px] mx-auto select-none font-sans"
    >
      <div className="profile-card absolute left-0 right-0 mx-auto sm:mx-0 sm:right-auto sm:left-[70px] top-[60px] sm:top-[80px] w-[90%] sm:w-[380px] h-[460px] bg-white border border-[#D9CEDF] rounded-[28px] p-6 sm:p-8 shadow-[0_26px_60px_rgba(23,19,31,0.1)] flex flex-col justify-between z-10 transition-shadow hover:shadow-[0_32px_75px_rgba(30,91,255,0.12)]">
        <div>
          {/* Profile Header */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-lg shadow-xs shrink-0">
              MT
            </div>
            <div className="space-y-0.5">
              <h3 className="font-display text-[26px] font-bold text-[#17131F] leading-tight">
                Mikeal Tadesse
              </h3>
              <span className="font-mono text-[10px] text-[#1E5BFF] uppercase tracking-wider block font-semibold">
                Product Designer · verified profile
              </span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-6">
            {/* Product Design */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#17131F] w-[110px] shrink-0">
                Product Design
              </span>
              <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                <div
                  className="bg-[#1E5BFF] h-full rounded-full progress-fill"
                  data-width="92%"
                />
              </div>
              <span className="font-display text-2xl font-bold text-[#1E5BFF] w-[30px] text-right">
                92
              </span>
            </div>

            {/* Figma */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#17131F] w-[110px] shrink-0">
                Figma
              </span>
              <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                <div
                  className="bg-[#FF8A5B] h-full rounded-full progress-fill"
                  data-width="88%"
                />
              </div>
              <span className="font-display text-2xl font-bold text-[#1E5BFF] w-[30px] text-right">
                88
              </span>
            </div>

            {/* UX Research */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#17131F] w-[110px] shrink-0">
                UX Research
              </span>
              <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                <div
                  className="bg-[#FF8A5B] h-full rounded-full progress-fill"
                  data-width="81%"
                />
              </div>
              <span className="font-display text-2xl font-bold text-[#1E5BFF] w-[30px] text-right">
                81
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Strip */}
        <div className="grid grid-cols-4 gap-1.5 pt-6 border-t border-[#D9CEDF]/60">
          <div className="bg-[#EEF3FF] rounded-lg p-1.5 sm:p-2 text-center flex flex-col justify-center items-center h-[60px] sm:h-[70px]">
            <span className="font-display text-lg font-bold text-[#1E5BFF] block leading-none">
              12
            </span>
            <span className="font-mono text-[8px] text-[#6E6678] uppercase mt-1 tracking-wider leading-none">
              projects
            </span>
          </div>
          <div className="bg-[#EEF3FF] rounded-lg p-2 text-center flex flex-col justify-center items-center h-[70px]">
            <span className="font-display text-lg font-bold text-[#1E5BFF] block leading-none">
              4
            </span>
            <span className="font-mono text-[8px] text-[#6E6678] uppercase mt-1 tracking-wider leading-none">
              assessments
            </span>
          </div>
          <div className="bg-[#EEF3FF] rounded-lg p-2 text-center flex flex-col justify-center items-center h-[70px]">
            <span className="font-display text-lg font-bold text-[#1E5BFF] block leading-none">
              3
            </span>
            <span className="font-mono text-[8px] text-[#6E6678] uppercase mt-1 tracking-wider leading-none">
              certs
            </span>
          </div>
          <div className="bg-[#EEF3FF] rounded-lg p-2 text-center flex flex-col justify-center items-center h-[70px]">
            <span className="font-display text-lg font-bold text-[#1E5BFF] block leading-none">
              17
            </span>
            <span className="font-mono text-[8px] text-[#6E6678] uppercase mt-1 tracking-wider leading-none">
              reviews
            </span>
          </div>
        </div>
      </div>

      {/* Floating Lifecycle Badges with Magnetic Hover */}
      {/* Learn */}
      <div
        className="floating-badge-container absolute left-0 sm:left-[10px] top-[10px] sm:top-[20px] z-20"
        style={{ opacity: 0 }}
      >
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-white border border-[#D9CEDF] rounded-[18px] px-5 py-3 shadow-[0_4px_12px_rgba(23,19,31,0.05)] cursor-pointer select-none font-mono text-xs font-semibold text-[#17131F]"
        >
          Learn
        </div>
      </div>

      {/* Practice */}
      <div
        className="floating-badge-container absolute right-0 sm:right-auto sm:left-[390px] top-[10px] sm:top-[20px] z-20"
        style={{ opacity: 0 }}
      >
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-white border border-[#D9CEDF] rounded-[18px] px-5 py-3 shadow-[0_4px_12px_rgba(23,19,31,0.05)] cursor-pointer select-none font-mono text-xs font-semibold text-[#17131F]"
        >
          Practice
        </div>
      </div>

      {/* Prove */}
      <div
        className="floating-badge-container absolute right-0 sm:right-auto sm:left-[430px] top-[250px] sm:top-[300px] z-20"
        style={{ opacity: 0 }}
      >
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-[#1E5BFF] border border-[#1E5BFF] rounded-[18px] px-5 py-3 shadow-[0_12px_24px_rgba(30,91,255,0.3)] cursor-pointer select-none font-mono text-xs font-bold text-white"
        >
          Prove
        </div>
      </div>

      {/* Get Hired */}
      <div
        className="floating-badge-container absolute left-0 sm:left-[5px] top-[460px] sm:top-[440px] z-20"
        style={{ opacity: 0 }}
      >
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-white border border-[#D9CEDF] rounded-[18px] px-5 py-3 shadow-[0_4px_12px_rgba(23,19,31,0.05)] cursor-pointer select-none font-mono text-xs font-semibold text-[#17131F]"
        >
          Get Hired
        </div>
      </div>
    </div>
  );
}
