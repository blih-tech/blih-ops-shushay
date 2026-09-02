"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button, UniversalSearch, Chip, GlobalNavbar } from "@blih/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { LandingProfileMockup } from "@/components/explore/LandingProfileMockup";
import { GrowthCycleStrip } from "@/components/explore/GrowthCycleStrip";

export default function SkillsHomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
  const TALENT_URL =
    process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002";
  const [searchQuery, setSearchQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".hero-anim-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      );
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
    },
    { scope: containerRef },
  );

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
    <div
      ref={containerRef}
      className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]"
    >
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
            <div className="hero-anim-item inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill & Talent Ecosystem</span>
            </div>

            <h1 className="hero-anim-item font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17131F] leading-[1.05]">
              Build skills <br />
              that lead <br />
              <span className="text-[#1E5BFF]">somewhere.</span>
            </h1>

            <p className="hero-anim-item font-sans text-lg sm:text-xl text-[#6E6678] leading-relaxed max-w-xl">
              Learn what matters, prove what you can do through real
              assessments, and turn your verified abilities into real career
              momentum.
            </p>

            {/* Universal Search */}
            <div className="hero-anim-item space-y-3 pt-2">
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
            <div className="hero-anim-item flex flex-wrap items-center gap-4 pt-4">
              <Link href="/courses">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
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

          {/* Right Column: Visual Interactive Graphic Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="preview-card-anim w-full max-w-[440px] transform hover:scale-[1.01] transition-transform duration-300">
              <LandingProfileMockup />
            </div>
          </div>
        </div>

        {/* Growth Cycle Section */}
        <div className="pt-8 border-t border-[#D9CEDF]/40">
          <GrowthCycleStrip />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-[#1E5BFF] transition-colors"
          >
            Courses
          </Link>
          <span className="text-[#D9CEDF]">·</span>
          <a
            href={`${TALENT_URL}/jobs`}
            className="hover:text-[#1E5BFF] transition-colors"
          >
            Opportunities
          </a>
          <span className="text-[#D9CEDF]">·</span>
          <a
            href={`${TALENT_URL}/profile`}
            className="hover:text-[#1E5BFF] transition-colors"
          >
            Talent
          </a>
        </div>
      </footer>
    </div>
  );
}
