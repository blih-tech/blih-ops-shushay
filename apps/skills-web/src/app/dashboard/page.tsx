"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  Badge,
  Spinner,
  GlobalNavbar,
  SkillBar,
  MetricCard,
} from "@blih/ui";
import { DashboardCoursesSkeleton } from "@/components/dashboard/DashboardCoursesSkeleton";
import {
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { fetchPublicCourses } from "@/lib/courses";
import type { PublicCourseListItem } from "@/types/course";

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<PublicCourseListItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [user, router]);

  useEffect(() => {
    fetchPublicCourses()
      .then(setCourses)
      .catch(() => { })
      .finally(() => setLoadingCourses(false));
  }, []);

  if (user?.role === "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-[#6E6678] font-sans animate-pulse">
          Redirecting to Admin Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="dashboard"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* Welcome & Momentum Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#D9CEDF]/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                Skills & Career Momentum
              </h1>
              {user?.role && <Badge variant="primary">{user.role}</Badge>}
            </div>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              Welcome back, <strong className="text-[#17131F]">{user?.email}</strong>. Here is your next growth move.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/courses">
              <Button variant="primary" size="md" leftIcon={<BookOpen className="w-4 h-4" />}>
                Explore Catalog
              </Button>
            </Link>
            <Link href="/certificates">
              <Button variant="outline" size="md" leftIcon={<Award className="w-4 h-4 text-[#2E8F79]" />}>
                My Credentials
              </Button>
            </Link>
          </div>
        </div>

        {/* Next Best Move Hero Card */}
        <div className="bg-gradient-to-br from-[#EEF3FF] via-white to-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(30,91,255,0.06)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended Next Step</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                Take the React Product Systems Assessment
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#6E6678] leading-relaxed max-w-2xl">
                Proving your capability with a score above 85% elevates your visibility to hiring companies and attaches verified proof to your public profile.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {courses.length > 0 ? (
                  <Link href={`/courses/${courses[0].id}/learn`}>
                    <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Resume Learning Track
                    </Button>
                  </Link>
                ) : (
                  <Link href="/courses">
                    <Button size="lg" variant="primary">
                      Browse Courses
                    </Button>
                  </Link>
                )}
                <span className="font-mono text-xs text-[#6E6678]">
                  Estimated time: 25 mins · 12 questions
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-[#D9CEDF] rounded-2xl p-6 shadow-sm space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678]">
                Projected Evidence Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-[#1E5BFF]">
                  +14%
                </span>
                <span className="font-sans text-xs text-[#2E8F79] font-medium">
                  Boost in Opportunity Match
                </span>
              </div>
              <SkillBar name="React Systems" score={92} status="Target: 92+" variant="primary" />
            </div>
          </div>
        </div>

        {/* Evidence & Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard value="2" label="Active Courses" variant="surface" />
          <MetricCard value="1" label="Earned Credentials" variant="surface" />
          <MetricCard value="94" label="Top Capability Score" variant="primary" />
          <MetricCard value="100%" label="Verification Status" variant="surface" />
        </div>

        {/* Active Learning & Catalog Rows */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#17131F]">
              Your Learning Tracks
            </h2>
            <Link href="/courses" className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] hover:underline">
              View All Courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingCourses ? (
              <DashboardCoursesSkeleton />
            ) : (
              courses.slice(0, 3).map((course, idx) => (
                <Card key={course.id} variant="interactive" className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] flex items-center justify-center text-[#1E5BFF]">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <Badge variant={idx === 0 ? "verified" : "secondary"} size="sm">
                        {idx === 0 ? "In Progress" : "Available"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </div>

                  <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono text-[#6E6678]">
                      <span>Progress</span>
                      <span>{idx === 0 ? "65%" : "0%"}</span>
                    </div>
                    <div className="w-full bg-[#EEF3FF] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E5BFF] h-full rounded-full"
                        style={{ width: idx === 0 ? "65%" : "0%" }}
                      />
                    </div>
                    <Link href={`/courses/${course.id}/learn`} className="w-full block pt-1">
                      <Button variant="outline" fullWidth size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        {idx === 0 ? "Continue Lesson" : "Start Course"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-12">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <Link href="/courses" className="hover:text-[#1E5BFF] transition-colors uppercase tracking-wider">
          Browse Courses
        </Link>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <DashboardContent />
    </AuthGuard>
  );
}
