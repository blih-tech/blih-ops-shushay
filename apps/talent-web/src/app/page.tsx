"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button, UniversalSearch, Chip, GlobalNavbar } from "@blih/ui";
import { Sparkles, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { HeroProfileMockup } from "@/components/explore/HeroProfileMockup";
import { FeaturedJobsPreview } from "@/components/explore/FeaturedJobsPreview";
import { EcosystemCanvas } from "@/components/explore/EcosystemCanvas";
import { TalentExplorerPreview } from "@/components/explore/TalentExplorerPreview";
import { CareerPathwayPreview } from "@/components/explore/CareerPathwayPreview";
import { SkillGraphPreview } from "@/components/explore/SkillGraphPreview";
import {
  MetricsBar,
  ActionBanner,
  ExploreFooter,
} from "@/components/explore/ExploreSectionBanners";

gsap.registerPlugin(ScrollTrigger);

export default function TalentHomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
  const SKILLS_URL =
    process.env.NEXT_PUBLIC_SKILLS_URL || "http://localhost:3001";
  const [searchQuery, setSearchQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Staggered fade-up hero elements
      gsap.fromTo(
        ".hero-anim-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      );

      // Smooth side reveal for the live card preview
      gsap.fromTo(
        ".preview-card-anim",
        { opacity: 0, x: 50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
        },
      );

      // Scroll trigger reveals for each primary section
      gsap.utils.toArray(".scroll-reveal-section").forEach((section: any) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  const searchChips =
    user?.role === "COMPANY"
      ? ["React 19", "Next.js", "Fullstack", "Node.js", "UI/UX Specialist"]
      : [
          "React Developer",
          "Product Designer",
          "Financial Analyst",
          "Fullstack Engineer",
          "UI/UX Specialist",
        ];

  const handleSearch = (query: string) => {
    if (user?.role === "COMPANY") {
      router.push(`/company/talents?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/jobs?q=${encodeURIComponent(query)}`);
    }
  };

  const isCompany = user?.role === "COMPANY";
  const isAdmin = user?.role === "ADMIN";
  const isTalent = user?.role === "TALENT";

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-[680px] bg-gradient-to-b from-[#EEF3FF] via-white/60 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="explore"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-24 sm:space-y-32">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="hero-anim-item inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isCompany
                  ? "Evidence-Backed Hiring Platform"
                  : isAdmin
                    ? "Platform Administration Studio"
                    : "Evidence-Backed Talent Platform"}
              </span>
            </div>

            <h1 className="hero-anim-item font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17131F] leading-[1.05]">
              {isCompany ? (
                <>
                  Hire proven talent <br />
                  that delivers <br />
                  <span className="text-[#1E5BFF]">from day one.</span>
                </>
              ) : isAdmin ? (
                <>
                  Curriculum & <br />
                  Talent Network <br />
                  <span className="text-[#1E5BFF]">Studio.</span>
                </>
              ) : (
                <>
                  Build skills <br />
                  that lead <br />
                  <span className="text-[#1E5BFF]">somewhere.</span>
                </>
              )}
            </h1>

            <p className="hero-anim-item font-sans text-lg sm:text-xl text-[#6E6678] leading-relaxed max-w-xl">
              {isCompany
                ? "Source pre-vetted African engineers with verified skill scores, project portfolios, and automated assessment deliverables."
                : isAdmin
                  ? "Manage published tracks, inspect graduate evidence submissions, and administer enterprise company access."
                  : "Learn what matters, prove what you can do through real assessments, and turn your abilities into verified opportunities with top companies."}
            </p>

            {/* Universal Search Container */}
            <div className="hero-anim-item space-y-3 pt-2">
              <UniversalSearch
                placeholder={
                  isCompany
                    ? "Search candidates by skill, technology, or title..."
                    : "What do you want to learn, do, or hire for?"
                }
                onSearch={handleSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                actionText="Search"
              />

              {/* Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {searchChips.map((chip, idx) => (
                  <Chip
                    key={chip}
                    active={idx === 0}
                    onClick={() => handleSearch(chip)}
                    size="sm"
                  >
                    {chip}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Call to Actions */}
            <div className="hero-anim-item flex flex-wrap items-center gap-4 pt-2">
              {isCompany ? (
                <>
                  <Link href="/company/talents">
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Search Verified Talents
                    </Button>
                  </Link>
                  <Link href="/company/jobs">
                    <Button size="lg" variant="outline">
                      Manage Job Openings
                    </Button>
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <Link href="/admin/courses">
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Edit Course Catalog
                    </Button>
                  </Link>
                  <Link href="/admin/talents">
                    <Button size="lg" variant="outline">
                      Talent Database
                    </Button>
                  </Link>
                </>
              ) : isTalent ? (
                <>
                  <Link href="/profile">
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      View My Skill Profile
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="outline" size="lg">
                      Explore Opportunities
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={`${AUTH_URL}/register`}>
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Start Building Your Profile
                    </Button>
                  </a>
                  <Link href="/jobs">
                    <Button variant="outline" size="lg">
                      Explore Opportunities
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Live Decision Surface Preview */}
          <div className="preview-card-anim lg:col-span-5 relative">
            <HeroProfileMockup />
          </div>
        </div>

        {/* Real-Time Ecosystem Metrics Strip */}
        <div className="scroll-reveal-section">
          <MetricsBar />
        </div>

        {/* Featured Live Opportunities Section */}
        <div className="scroll-reveal-section">
          <FeaturedJobsPreview />
        </div>

        {/* Continuous Growth Ecosystem Canvas */}
        <div className="scroll-reveal-section">
          <EcosystemCanvas />
        </div>

        {/* Talent Explorer Product Preview */}
        <div className="scroll-reveal-section">
          <TalentExplorerPreview />
        </div>

        {/* Career Pathway Experience */}
        <div className="scroll-reveal-section">
          <CareerPathwayPreview />
        </div>

        {/* Skill Graph Section */}
        <div className="scroll-reveal-section">
          <SkillGraphPreview />
        </div>

        {/* Dynamic Action Banner */}
        <div className="scroll-reveal-section">
          <ActionBanner role={user?.role} skillsUrl={SKILLS_URL} />
        </div>
      </main>

      {/* Page Footer */}
      <ExploreFooter role={user?.role} />
    </div>
  );
}
