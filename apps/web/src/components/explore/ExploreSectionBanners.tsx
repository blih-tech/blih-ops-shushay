"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Badge, Button } from "@blih/ui";
import { ShieldCheck, Users, Briefcase, Award, ArrowRight } from "lucide-react";
import { MOCK_EXPLORE_METRICS } from "@/data/mockExploreData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MetricsBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        ".gsap-metric-card",
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  const icons = [
    <Users key="users" className="w-5 h-5 text-[#1E5BFF]" />,
    <Briefcase key="briefcase" className="w-5 h-5 text-[#FF8A5B]" />,
    <Award key="award" className="w-5 h-5 text-[#1E5BFF]" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-[#2E8F79]" />,
  ];

  return (
    <div
      ref={containerRef}
      className="w-full bg-gradient-to-r from-[#EEF3FF] via-white to-[#EEF3FF] border border-[#D9CEDF]/70 rounded-3xl p-6 sm:p-8 shadow-[0_12px_32px_rgba(30,91,255,0.04)]"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#D9CEDF]/50">
        {MOCK_EXPLORE_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className={`gsap-metric-card flex flex-col space-y-2 transition-all duration-300 hover:-translate-y-1 ${
              idx > 0 ? "pt-4 sm:pt-0 sm:pl-6 lg:pl-8" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-xl border border-[#D9CEDF]/50 shadow-2xs">
                {icons[idx]}
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#17131F] tracking-tight">
                {metric.value}
              </span>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-[#17131F]">
                {metric.label}
              </p>
              <p className="font-mono text-[11px] text-[#6E6678] mt-0.5">
                {metric.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ActionBannerProps {
  role?: string;
  skillsUrl?: string;
}

export function ActionBanner({ role, skillsUrl = "" }: ActionBannerProps) {
  const isCompany = role === "COMPANY";
  const isAdmin = role === "ADMIN";
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.to(".gsap-ambient-glow", {
        scale: 1.25,
        opacity: 0.7,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        ".gsap-banner-content",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-white via-[#EEF3FF]/40 to-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-[0_12px_40px_rgba(30,91,255,0.06)] relative overflow-hidden"
    >
      <div className="gsap-ambient-glow absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-[#1E5BFF]/15 to-[#FF8A5B]/15 rounded-full blur-3xl pointer-events-none" />

      {isCompany ? (
        <>
          <div className="gsap-banner-content space-y-3 max-w-xl z-10">
            <Badge variant="verified" size="sm">
              Talent Pipeline Ready
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F] leading-tight">
              Find and hire pre-vetted African engineering talent
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              Review evidence-backed scorecards, calibrate technical fit, and
              contact qualified candidates directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
            <Link href="/company/talents" className="w-full sm:w-auto">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Search Talent Catalog
              </Button>
            </Link>
            <Link href="/company/jobs" className="w-full sm:w-auto">
              <Button size="lg" variant="outline">
                Post an Open Role
              </Button>
            </Link>
          </div>
        </>
      ) : isAdmin ? (
        <>
          <div className="gsap-banner-content space-y-3 max-w-2xl z-10">
            <Badge variant="primary" size="sm">
              Platform Administration
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F] leading-tight">
              Manage curriculum, talents, and hiring authorizations
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              Oversee track publications, verify evidence profiles, and maintain
              platform quality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 z-10">
            <Link href="/admin" className="w-full sm:w-auto">
              <Button
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Admin Portal
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="gsap-banner-content space-y-3 max-w-2xl z-10">
            <Badge variant="coral" size="sm">
              Hiring Opportunities Live
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F] leading-tight">
              Explore verified roles matched to your abilities
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              Browse open positions with upfront salary ranges, remote
              arrangements, and required skill benchmarks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 z-10">
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

import { GlobalFooter } from "@blih/ui";

export interface ExploreFooterProps {
  role?: string;
}

export function ExploreFooter({ role }: ExploreFooterProps) {
  return <GlobalFooter user={role ? { role } : null} />;
}
