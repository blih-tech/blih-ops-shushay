"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import {
  Button,
  Badge,
  UniversalSearch,
  Chip,
  GlobalNavbar,
  SkillBar,
  Skeleton,
  Card,
} from "@blih/ui";
import { MapPin, DollarSign, Sparkles, ArrowUpRight } from "lucide-react";

import { mockJobs, type JobPosting } from "@/data";

function JobCardSkeleton() {
  return (
    <Card className="border border-[#D9CEDF] rounded-3xl bg-white p-5 sm:p-7 space-y-4 h-[180px] flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton
              variant="rectangular"
              width={60}
              height={12}
              className="rounded-md"
            />
            <Skeleton
              variant="rectangular"
              width={180}
              height={20}
              className="rounded-md"
            />
          </div>
          <Skeleton
            variant="rectangular"
            width={75}
            height={22}
            className="rounded-lg"
          />
        </div>
        <Skeleton variant="text" className="w-full" />
      </div>
      <div className="pt-3 border-t border-[#D9CEDF]/50 flex justify-between items-center">
        <div className="flex gap-4">
          <Skeleton
            variant="rectangular"
            width={80}
            height={12}
            className="rounded-md"
          />
          <Skeleton
            variant="rectangular"
            width={60}
            height={12}
            className="rounded-md"
          />
        </div>
        <Skeleton
          variant="rectangular"
          width={50}
          height={10}
          className="rounded-md"
        />
      </div>
    </Card>
  );
}

function JobsFeedContent() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPosting>(mockJobs[0]);
  const [activeFilter, setActiveFilter] = useState("All Opportunities");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filterChips = [
    "All Opportunities",
    "Frontend",
    "Fullstack",
    "Design Systems",
    "90%+ Match",
  ];

  const filteredJobs = mockJobs.filter((job) => {
    if (activeFilter === "90%+ Match" && job.matchScore < 90) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="opportunities"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Opportunity Discovery</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F]">
            Evidence-Matched Roles
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
            Discover remote opportunities scored directly against your verified
            capability profile.
          </p>
        </div>

        {/* Universal Search & Filters */}
        <div className="space-y-4">
          <UniversalSearch
            placeholder="Search roles, companies, or required competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            actionText="Filter Roles"
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {filterChips.map((chip) => (
              <Chip
                key={chip}
                active={activeFilter === chip}
                onClick={() => setActiveFilter(chip)}
                size="md"
              >
                {chip}
              </Chip>
            ))}
          </div>
        </div>

        {/* Two-Column Master / Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Cards List */}
          <div className="lg:col-span-7 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                {filteredJobs.map((job) => {
                  const isSelected = selectedJob.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`bg-white border rounded-3xl p-5 sm:p-7 transition-all duration-300 cursor-pointer select-none space-y-4 ${
                        isSelected
                          ? "border-[#1E5BFF] shadow-[0_12px_40px_rgba(30,91,255,0.08)] bg-gradient-to-r from-white to-[#EEF3FF]/40"
                          : "border-[#D9CEDF] hover:border-[#1E5BFF]/50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-xs text-[#1E5BFF] font-semibold">
                            {job.company}
                          </span>
                          <h3 className="font-display text-lg sm:text-xl font-bold text-[#17131F] mt-0.5">
                            {job.title}
                          </h3>
                        </div>

                        <Badge
                          variant={
                            job.matchScore >= 90 ? "verified" : "primary"
                          }
                          size="md"
                        >
                          {job.matchScore}% Match
                        </Badge>
                      </div>

                      <p className="font-sans text-sm text-[#6E6678] line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9CEDF]/50 text-xs font-sans text-[#6E6678]">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 font-medium text-[#17131F]">
                            <DollarSign className="w-3.5 h-3.5 text-[#2E8F79]" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" />
                            {job.location}
                          </span>
                        </div>

                        <span className="font-mono text-[11px] text-[#6E6678]">
                          {job.postedDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: "Your Match" Decision Panel & Quick Preview */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-5 sm:p-8 shadow-[0_12px_48px_rgba(30,91,255,0.06)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9CEDF]/70">
                <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
                  Opportunity Decision Panel
                </span>
                <Badge variant="verified" size="md">
                  {selectedJob.matchScore}% Calibrated Fit
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-[#17131F]">
                  {selectedJob.title}
                </h2>
                <p className="font-sans text-sm font-semibold text-[#1E5BFF]">
                  {selectedJob.company} · {selectedJob.location}
                </p>
                <p className="font-mono text-xs font-bold text-[#2E8F79]">
                  {selectedJob.salary}
                </p>
              </div>

              <div className="space-y-2 text-sm text-[#6E6678] font-sans leading-relaxed">
                <p>{selectedJob.description}</p>
              </div>

              {/* Match breakdown */}
              <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-2xl p-5 space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#17131F] font-bold block">
                  Required Competency Match
                </span>
                {selectedJob.requiredSkills.map((req) => (
                  <SkillBar
                    key={req.name}
                    name={req.name}
                    score={req.score}
                    status="Verified"
                    variant="primary"
                  />
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Apply with Verified Skill Profile
                </Button>
                <p className="text-center font-mono text-[11px] text-[#6E6678]">
                  Your verified assessment proof and portfolio will be submitted
                  directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-16">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          <Link href="/profile" className="hover:text-[#1E5BFF]">
            My Profile
          </Link>
          <span className="text-[#D9CEDF]">·</span>
          <Link href="/company" className="hover:text-[#1E5BFF]">
            For Companies
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function JobsPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <JobsFeedContent />
    </AuthGuard>
  );
}
