"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  Badge,
  UniversalSearch,
  Chip,
  SkillBar,
  GlobalNavbar,
} from "@/components/ui";
import {
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
} from "lucide-react";

export default function TalentHomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
  const SKILLS_URL = process.env.NEXT_PUBLIC_SKILLS_URL || "http://localhost:3001";
  const [searchQuery, setSearchQuery] = useState("");

  const searchChips = user?.role === "COMPANY"
    ? ["React 19", "Next.js", "Fullstack", "Node.js", "UI/UX Specialist"]
    : ["React Developer", "Product Designer", "Financial Analyst", "Fullstack Engineer", "UI/UX Specialist"];

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
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-[640px] bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="explore"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-20 sm:space-y-28">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isCompany
                  ? "Evidence-Backed Hiring Platform"
                  : isAdmin
                  ? "Platform Administration Studio"
                  : "Evidence-Backed Talent Platform"}
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17131F] leading-[1.05]">
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

            <p className="font-sans text-lg sm:text-xl text-[#6E6678] leading-relaxed max-w-xl">
              {isCompany
                ? "Source pre-vetted African engineers with verified skill scores, project portfolios, and automated assessment deliverables."
                : isAdmin
                ? "Manage published tracks, inspect graduate evidence submissions, and administer enterprise company access."
                : "Learn what matters, prove what you can do through real assessments, and turn your abilities into verified opportunities with top companies."}
            </p>

            {/* Universal Search Container */}
            <div className="space-y-3 pt-2">
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
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {isCompany ? (
                <>
                  <Link href="/company/talents">
                    <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Search Verified Talents
                    </Button>
                  </Link>
                  <Link href="/company/jobs">
                    <Button variant="outline" size="lg">
                      Manage Job Posts
                    </Button>
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <a href={`${SKILLS_URL}/admin`}>
                    <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Open Admin Hub
                    </Button>
                  </a>
                  <a href={`${SKILLS_URL}/admin/courses`}>
                    <Button variant="outline" size="lg">
                      Course Studio
                    </Button>
                  </a>
                </>
              ) : isTalent ? (
                <>
                  <Link href="/profile">
                    <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
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
                    <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
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
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(23,19,31,0.08)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9CEDF]/60">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] font-display font-bold text-xl">
                    MA
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#17131F]">
                      Mikael Abebe
                    </h3>
                    <Badge variant="verified" size="sm">
                      Verified Frontend Engineer
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Capability Bars */}
              <div className="space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E6678] block">
                  Capability Breakdown
                </span>
                <SkillBar name="React Systems" score={94} status="Verified" variant="primary" />
                <SkillBar name="TypeScript" score={89} status="Verified" variant="primary" />
                <SkillBar name="Accessibility" score={82} status="Developing" variant="coral" />
              </div>

              {/* Verified Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D9CEDF]/60">
                <div className="bg-[#EEF3FF] rounded-2xl p-3 text-center">
                  <span className="font-display text-xl font-bold text-[#1E5BFF] block">
                    4
                  </span>
                  <span className="font-mono text-[10px] text-[#6E6678]">
                    Assessments
                  </span>
                </div>
                <div className="bg-[#EEF3FF] rounded-2xl p-3 text-center">
                  <span className="font-display text-xl font-bold text-[#1E5BFF] block">
                    12
                  </span>
                  <span className="font-mono text-[10px] text-[#6E6678]">
                    Projects
                  </span>
                </div>
                <div className="bg-[#EEF3FF] rounded-2xl p-3 text-center">
                  <span className="font-display text-xl font-bold text-[#2E8F79] block">
                    17
                  </span>
                  <span className="font-mono text-[10px] text-[#6E6678]">
                    Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continuous Growth Ecosystem Canvas */}
        <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
                ONE PROFILE, CONTINUOUS GROWTH
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17131F]">
                Evidence becomes professional identity.
              </h2>
            </div>
            <p className="font-sans text-sm sm:text-base text-[#6E6678] max-w-md">
              Learning, assessments, real projects and reviews strengthen one Skill Profile instead of living in separate places.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <Card className="bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl mb-2">Verified Capabilities</CardTitle>
              <CardDescription>
                Stand out with proof scores calibrated by automated testing and expert evaluations.
              </CardDescription>
            </Card>

            <Card className="bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl mb-2">Evidence-Matched Jobs</CardTitle>
              <CardDescription>
                Receive tailored opportunity recommendations where your verified skills directly match employer requirements.
              </CardDescription>
            </Card>

            <Card className="bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl mb-2">For Growing Companies</CardTitle>
              <CardDescription>
                Hire talent based on demonstrated abilities, reducing recruitment friction and onboarding ramp-up.
              </CardDescription>
            </Card>
          </div>
        </div>

        {/* Dynamic Role-Aware Action Banner */}
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-[0_12px_40px_rgba(30,91,255,0.05)]">
          {isCompany ? (
            <>
              <div className="space-y-3 max-w-xl">
                <Badge variant="verified" size="sm">
                  Talent Pipeline Ready
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F]">
                  Find and hire pre-vetted African engineering talent
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#6E6678]">
                  Review evidence-backed scorecards, calibrate technical fit, and contact qualified candidates directly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
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
              <div className="space-y-3 max-w-2xl">
                <Badge variant="primary" size="sm">
                  Platform Administration
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F]">
                  Manage curriculum, talents, and hiring authorizations
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#6E6678]">
                  Oversee track publications, verify evidence profiles, and maintain platform quality.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <a href={`${SKILLS_URL}/admin`} className="w-full sm:w-auto">
                  <Button size="lg" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Go to Admin Portal
                  </Button>
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3 max-w-2xl">
                <Badge variant="coral" size="sm">
                  Hiring Opportunities Live
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F]">
                  Explore verified roles matched to your abilities
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#6E6678]">
                  Browse open positions with upfront salary ranges, remote arrangements, and required skill benchmarks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Browse Opportunities
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-16">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          {isCompany ? (
            <>
              <Link href="/company/talents" className="hover:text-[#1E5BFF] transition-colors">
                Talent Search
              </Link>
              <span className="text-[#D9CEDF]">·</span>
              <Link href="/company/jobs" className="hover:text-[#1E5BFF] transition-colors">
                Job Posts
              </Link>
              <span className="text-[#D9CEDF]">·</span>
              <Link href="/company/subscription" className="hover:text-[#1E5BFF] transition-colors">
                Subscription
              </Link>
              <span className="text-[#D9CEDF]">·</span>
              <Link href="/company/profile" className="hover:text-[#1E5BFF] transition-colors">
                Company Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="hover:text-[#1E5BFF] transition-colors">
                Talent Profile
              </Link>
              <span className="text-[#D9CEDF]">·</span>
              <Link href="/jobs" className="hover:text-[#1E5BFF] transition-colors">
                Opportunities
              </Link>
              <span className="text-[#D9CEDF]">·</span>
              <Link href="/company" className="hover:text-[#1E5BFF] transition-colors">
                For Companies
              </Link>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
