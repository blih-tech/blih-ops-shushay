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
  MetricCard,
} from "@blih/ui";
import { DashboardCoursesSkeleton } from "@/components/dashboard/DashboardCoursesSkeleton";
import { VerifiedSkillsCard } from "@/components/dashboard/VerifiedSkillsCard";
import {
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Briefcase,
  User,
} from "lucide-react";
import { fetchPublicCourses } from "@/lib/courses";
import { getCourseProgress } from "@blih/api-client";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { getUniqueCertificates } from "@/components/profile/VerifiedCredentialsCard";
import type { PublicCourseListItem } from "@/types/course";

interface ProgressItem {
  progressPercentage: number;
  isCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const { profile } = useTalentProfile();
  const router = useRouter();
  const [courses, setCourses] = useState<PublicCourseListItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressItem>>(
    {},
  );

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [user, router]);

  useEffect(() => {
    fetchPublicCourses()
      .then(async (fetchedCourses) => {
        setCourses(fetchedCourses);

        const progressResults = await Promise.allSettled(
          fetchedCourses.map((c) => getCourseProgress(c.id)),
        );

        const map: Record<string, ProgressItem> = {};
        progressResults.forEach((res, idx) => {
          const courseId = fetchedCourses[idx].id;
          if (res.status === "fulfilled" && res.value) {
            map[courseId] = {
              progressPercentage: res.value.progressPercentage ?? 0,
              isCompleted: res.value.isCompleted ?? false,
              completedLessons: res.value.completedLessons ?? 0,
              totalLessons: res.value.totalLessons ?? 0,
            };
          }
        });
        setProgressMap(map);
      })
      .catch(() => {})
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

  const completedFromProgress = Object.values(progressMap).filter(
    (p) => p.isCompleted,
  ).length;
  const uniqueCerts = getUniqueCertificates(
    profile?.certificates,
    profile?.completedCourses,
  );
  const certCount = profile?.certificates
    ? uniqueCerts.length
    : completedFromProgress;

  const totalInProgress = Object.values(progressMap).filter(
    (p) => p.progressPercentage > 0 && !p.isCompleted,
  ).length;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D9CEDF]/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Skills & Career Momentum
            </h1>
            {user?.role && <Badge variant="primary">{user.role}</Badge>}
          </div>
          <p className="font-sans text-sm sm:text-base text-[#6E6678]">
            Welcome back,{" "}
            <strong className="text-[#17131F]">{user?.email}</strong>. Here is
            your next growth move.
          </p>
        </div>

        {/* Clean, Single-Row Header Action Group */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto shrink-0 py-1.5 -my-1.5">
          <Link href="/courses" className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              className="h-10 text-xs sm:text-sm px-3.5 sm:px-4 shadow-none hover:shadow-none"
            >
              Explore Catalog
            </Button>
          </Link>
          <Link href="/jobs" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Briefcase className="w-3.5 h-3.5 text-[#1E5BFF]" />}
              className="h-10 text-xs sm:text-sm px-3.5 sm:px-4 shadow-none hover:shadow-none"
            >
              Job Openings
            </Button>
          </Link>
          <Link href="/certificates" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Award className="w-3.5 h-3.5 text-[#2E8F79]" />}
              className="h-10 text-xs sm:text-sm px-3.5 sm:px-4 shadow-none hover:shadow-none"
            >
              <span>Credentials</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#E6F6ED] text-[#2E8F79] border border-[#BDE8D0]">
                {certCount}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card
          variant="surface"
          className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden bg-white border border-[#D9CEDF] rounded-xl shadow-sm"
        >
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-[#17131F]">
              <Sparkles className="w-4 h-4 text-[#17131F]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                System Recommendation
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl">
              Ready for your next engineering milestone?
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-[#6E6678]">
              Completing course tracks unlocks verified capability badges on
              your public Blih Talent profile, connecting you directly to top
              client opportunities.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={courses[0] ? `/courses/${courses[0].id}/learn` : "/courses"}
            >
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue Learning Path
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<User className="w-4 h-4 text-[#17131F]" />}
              >
                View Profile & Evidence
              </Button>
            </Link>
          </div>
        </Card>

        <VerifiedSkillsCard
          totalCompleted={certCount}
          skills={profile?.skills}
          isComplete={!!profile?.isComplete}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          value={String(totalInProgress)}
          label="Active Courses"
          variant="surface"
        />
        <MetricCard
          value={String(certCount)}
          label="Earned Credentials"
          variant="surface"
        />
        <MetricCard
          value={String(profile?.skills?.length || 0)}
          label="Verified Skills"
          variant="surface"
        />
        <MetricCard
          value={`${profile?.profileCompletion?.percentage ?? (certCount > 0 ? 100 : 0)}%`}
          label="Profile Completion"
          variant="primary"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[#17131F]">
            Your Learning Tracks
          </h2>
          <Link
            href="/courses"
            className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] hover:underline"
          >
            View All Courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingCourses ? (
            <DashboardCoursesSkeleton />
          ) : (
            courses.slice(0, 3).map((course) => {
              const prog = progressMap[course.id] || {
                progressPercentage: 0,
                isCompleted: false,
              };
              const percent = prog.progressPercentage;
              const isCompleted = prog.isCompleted;
              const isInProgress = percent > 0 && !isCompleted;

              return (
                <Card
                  key={course.id}
                  variant="interactive"
                  className="flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#D9CEDF] flex items-center justify-center text-[#17131F] shadow-xs">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <Badge
                        variant={
                          isCompleted
                            ? "verified"
                            : isInProgress
                              ? "primary"
                              : "secondary"
                        }
                        size="sm"
                      >
                        {isCompleted
                          ? "Completed"
                          : isInProgress
                            ? "In Progress"
                            : "Available"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>

                  <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono text-[#6E6678]">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-[#EAE5F0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-[#2E8F79]" : "bg-[#1E5BFF]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="w-full block pt-1"
                    >
                      <Button
                        variant="outline"
                        fullWidth
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {isCompleted
                          ? "Review Course"
                          : isInProgress
                            ? "Continue Lesson"
                            : "Start Course"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <DashboardContent />
    </AuthGuard>
  );
}
