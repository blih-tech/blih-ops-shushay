"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  Button,
  Card,
  Badge,
  UniversalSearch,
  Chip,
  SkillBar,
  GlobalNavbar,
} from "@/components/ui";
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Code,
  Award,
} from "lucide-react";

export default function SkillsHomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
  const [searchQuery, setSearchQuery] = useState("");

  const searchChips = [
    "React Developer",
    "Financial Analysis",
    "UI Design",
    "Learn Python",
    "Accessibility Systems",
  ];

  const handleSearch = (query: string) => {
    router.push(`/courses?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="skills"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Search */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill & Talent Ecosystem</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17131F] leading-[1.05]">
              Build skills <br />
              that lead <br />
              <span className="text-[#1E5BFF]">somewhere.</span>
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#6E6678] leading-relaxed max-w-xl">
              Learn what matters, prove what you can do through real assessments, and turn your verified abilities into real career momentum.
            </p>

            {/* Universal Search */}
            <div className="space-y-3 pt-2">
              <UniversalSearch
                placeholder="What skill do you want to master or prove?"
                onSearch={handleSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                actionText="Explore"
              />

              {/* Filter Chips */}
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

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/courses">
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Course Catalog
                </Button>
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Go to My Dashboard
                  </Button>
                </Link>
              ) : (
                <a href={`${AUTH_URL}/register`}>
                  <Button variant="secondary" size="lg">
                    Start Your Skill Profile
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Ecosystem Visual */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(23,19,31,0.08)] relative">
              {/* Badge & Name Header */}
              <div className="flex items-start justify-between pb-6 border-b border-[#D9CEDF]/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-2xl font-bold text-[#17131F]">
                      Sara Tesfaye
                    </h3>
                    <Badge variant="verified" size="sm">
                      Verified Profile
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-[#1E5BFF]">
                    Frontend Engineer · Next.js Specialist
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] font-display font-bold text-lg">
                  ST
                </div>
              </div>

              {/* Skills breakdown with confidence rails */}
              <div className="py-6 space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E6678] block mb-2">
                  Evidence-Backed Capabilities
                </span>
                <SkillBar
                  name="React Product Systems"
                  score={94}
                  status="Verified"
                  variant="primary"
                />
                <SkillBar
                  name="TypeScript Architecture"
                  score={89}
                  status="Verified"
                  variant="primary"
                />
                <SkillBar
                  name="Accessibility & UI Design"
                  score={82}
                  status="Developing"
                  variant="coral"
                />
              </div>

              {/* Evidence metrics bottom bar */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D9CEDF]/60">
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
                    100%
                  </span>
                  <span className="font-mono text-[10px] text-[#6E6678]">
                    Proof Score
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Floating Card */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white border border-[#D9CEDF] rounded-2xl p-4 shadow-lg items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-[#17131F]">
                  Credential Verified
                </p>
                <p className="font-mono text-[10px] text-[#6E6678]">
                  Direct proof attached to profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem Lifecycle Strip */}
        <div className="bg-[#EEF3FF] border border-[#D9CEDF]/80 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="font-mono text-xs text-[#1E5BFF] uppercase tracking-wider font-semibold">
              The Continuous Growth Cycle
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              How abilities turn into opportunities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-display text-xl font-bold text-[#17131F]">
                Learn
              </h3>
              <p className="font-sans text-sm text-[#6E6678]">
                Master practical modern stacks with industry-calibrated courses and coding exercises.
              </p>
            </div>

            <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-display text-xl font-bold text-[#17131F]">
                Practice
              </h3>
              <p className="font-sans text-sm text-[#6E6678]">
                Build real application briefs with test suites, architectural decisions, and portfolio work.
              </p>
            </div>

            <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-display text-xl font-bold text-[#17131F]">
                Prove
              </h3>
              <p className="font-sans text-sm text-[#6E6678]">
                Take rigorous skill assessments and generate verifiable digital certificates with score records.
              </p>
            </div>

            <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-display text-xl font-bold text-[#17131F]">
                Get Hired
              </h3>
              <p className="font-sans text-sm text-[#6E6678]">
                Match automatically with companies hiring for proven capabilities on Blih Talent.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          <Link href="/courses" className="hover:text-[#1E5BFF] transition-colors">
            Courses
          </Link>
          <span className="text-[#D9CEDF]">·</span>
          <a href="http://localhost:3002/jobs" className="hover:text-[#1E5BFF] transition-colors">
            Opportunities
          </a>
          <span className="text-[#D9CEDF]">·</span>
          <a href="http://localhost:3002/profile" className="hover:text-[#1E5BFF] transition-colors">
            Talent
          </a>
        </div>
      </footer>
    </div>
  );
}
