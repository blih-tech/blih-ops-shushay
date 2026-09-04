"use client";

import React, { use, useRef } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { Badge } from "@blih/ui";
import { ArrowLeft, CheckCircle2, Briefcase, Globe } from "lucide-react";
import { mockTalents } from "@/data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface PageProps {
  params: Promise<{ talentId: string }>;
}

function CompanyTalentDetailsContent({ talentId }: { talentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the selected talent from mock database, default to Mikeal Tadesse (tal-1)
  const talent = mockTalents.find((t) => t.id === talentId) || mockTalents[0];

  useGSAP(
    () => {
      // Scroll-triggered slide/scale reveal for profile cards & blocks
      gsap.fromTo(
        ".reveal-profile-block",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full font-sans selection:bg-[#DDE7FF]"
    >

      {/* Sub-header Breadcrumb line */}
      <div className="border-b border-[#E6EAF3] py-4 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/company/talents"
            className="flex items-center gap-2 text-sm font-semibold text-[#1E5BFF] hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to talent directory
          </Link>
          <div className="font-mono text-xs text-[#6E6678]">
            Calibrated Profile
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Talent Profile Hero Section */}
        <section className="reveal-profile-block border-b border-[#E6EAF3] pb-12">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              {/* Profile Portrait */}
              <div className="h-[118px] w-[118px] rounded-full border border-[#BFD0FF] bg-[#EEF3FF] flex items-center justify-center overflow-hidden shrink-0 relative">
                <span className="font-display font-bold text-[34px] text-[#1E5BFF]">
                  {talent.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
                <div className="absolute bottom-1 right-1 h-5 w-5 bg-[#2E8F79] rounded-full border-2 border-white flex items-center justify-center text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#17131F] leading-tight tracking-tight">
                  {talent.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-sans text-xl font-semibold text-[#1E5BFF]">
                    {talent.title}
                  </h3>
                  {talent.englishLevel && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5"
                    >
                      <Globe className="h-3 w-3 inline mr-1 text-[#1E5BFF]" />
                      English: {talent.englishLevel}
                    </Badge>
                  )}
                </div>

                {/* Contact & Location Strip */}
                <div className="flex flex-col gap-y-1.5 text-sm text-[#6E6678] pt-2 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#1E5BFF] font-sans font-semibold w-16">
                      Email:
                    </span>
                    <span className="text-[#17131F] font-semibold">
                      {talent.name.toLowerCase().replace(" ", ".")}@blih.org
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#1E5BFF] font-sans font-semibold w-16">
                      Phone:
                    </span>
                    <span className="text-[#17131F] font-semibold">
                      +251 912 345 678
                    </span>
                  </div>
                  {talent.location && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1E5BFF] font-sans font-semibold w-16">
                        Location:
                      </span>
                      <span className="text-[#17131F] font-semibold">
                        {talent.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specialization / Skills */}
            {talent.skills && talent.skills.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="font-sans text-xs font-bold text-[#6E6678] uppercase tracking-wider block">
                  Core Capabilities
                </span>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[#F4F7FF] text-[#1E5BFF] border border-[#1E5BFF]/10 rounded-full text-xs font-mono font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio Narrative */}
            {talent.bio && (
              <div className="space-y-3 pt-4 border-t border-[#E6EAF3]/75">
                <span className="font-sans text-xs font-bold text-[#6E6678] uppercase tracking-wider block">
                  Biography
                </span>
                <p className="font-sans text-[18px] text-[#17131F] leading-relaxed font-normal whitespace-pre-line">
                  {talent.bio}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="reveal-profile-block space-y-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-[#1E5BFF]" />
            <h2 className="font-display text-2xl font-bold text-[#17131F]">
              Work Experience
            </h2>
          </div>

          <div className="divide-y divide-[#E6EAF3] border-t border-b border-[#E6EAF3]">
            <div className="py-6 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h4 className="font-sans text-lg font-bold text-[#17131F]">
                  Senior Systems Engineer
                </h4>
                <span className="text-xs font-mono text-[#6E6678]">
                  2024 – Present
                </span>
              </div>
              <p className="text-sm font-semibold text-[#1E5BFF]">BunaOps</p>
              <p className="text-sm text-[#6E6678] leading-relaxed max-w-3xl pt-1">
                Designed and engineered key enterprise application flows,
                operational dashboards, and database schemas.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CompanyTalentDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyTalentDetailsContent talentId={resolvedParams.talentId} />
    </AuthGuard>
  );
}
