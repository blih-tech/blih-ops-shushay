"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  Play,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  Button,
  Badge,
  Alert,
  Skeleton,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  GlobalNavbar,
} from "@/components/ui";
import { fetchPublicCourse } from "@/lib/courses";
import type { PublicCourse, PublicLesson } from "@/types/course";
import { useAuth } from "@/providers/AuthProvider";

function LessonRow({ lesson, index }: { lesson: PublicLesson; index: number }) {
  const [open, setOpen] = useState(false);
  const hasVideo = !!lesson.videoUrl;
  const docCount = lesson.documents?.length || 0;
  const hasQuiz = !!lesson.quiz;
  const hasAssignment = !!lesson.assignment;

  return (
    <div className="border border-[#D9CEDF] rounded-2xl overflow-hidden bg-white hover:border-[#1E5BFF]/40 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-[#1E5BFF]/15">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-sans font-medium text-sm sm:text-base text-[#17131F] truncate">
            {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasVideo && (
            <span className="p-1 text-[#6E6678]" title="Video Lesson">
              <Video className="h-4 w-4" />
            </span>
          )}
          {hasQuiz && (
            <span className="p-1 text-[#6E6678]" title="Assessment Quiz">
              <HelpCircle className="h-4 w-4" />
            </span>
          )}
          {hasAssignment && (
            <span className="p-1 text-[#6E6678]" title="Practical Assignment">
              <ClipboardList className="h-4 w-4" />
            </span>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4 text-[#6E6678] ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#6E6678] ml-1" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 border-t border-[#D9CEDF]/60 bg-[#EEF3FF]/40 space-y-3">
          <div className="flex flex-wrap gap-2">
            {hasVideo && <Badge variant="primary" size="sm">Video Lesson</Badge>}
            {docCount > 0 && <Badge variant="secondary" size="sm">{docCount} Document{docCount > 1 ? "s" : ""}</Badge>}
            {hasQuiz && <Badge variant="verified" size="sm">Quiz: {lesson.quiz!.title}</Badge>}
            {hasAssignment && <Badge variant="coral" size="sm">Assignment: {lesson.assignment!.title}</Badge>}
            {!hasVideo && docCount === 0 && !hasQuiz && !hasAssignment && (
              <span className="text-xs text-[#6E6678] font-sans">Reading & Theory Material</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user, logout } = useAuth();
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicCourse(courseId)
      .then(setCourse)
      .catch((err) => setError(err.message ?? "Course not found"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased">
        <GlobalNavbar currentApp="skills" user={user ? { email: user.email, role: user.role } : null} onSignOut={logout} />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton variant="rectangular" height={32} className="w-48 rounded-xl" />
          <Skeleton variant="rectangular" height={260} className="rounded-3xl" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={64} className="rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased">
        <GlobalNavbar currentApp="skills" user={user ? { email: user.email, role: user.role } : null} onSignOut={logout} />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          <Link href="/courses">
            <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Catalog
            </Button>
          </Link>
          <Alert variant="error">{error ?? "Course not found"}</Alert>
        </main>
      </div>
    );
  }

  const lessonCount = course.lessons.length;

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="skills"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        <Link href="/courses" className="inline-block">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">
            Back to Course Catalog
          </Button>
        </Link>

        {/* Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Course Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(23,19,31,0.04)] space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="md">
                  {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
                </Badge>
                <Badge variant="verified" size="md">
                  Verified Assessment Included
                </Badge>
                <Badge variant="secondary" size="md">
                  Remote-Ready Track
                </Badge>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17131F] leading-tight">
                {course.title}
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
                {course.description}
              </p>

              {/* What you will achieve */}
              <div className="pt-4 border-t border-[#D9CEDF]/60 space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
                  What you will be able to do
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E8F79] shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-[#17131F]">
                      Build scalable architecture and state systems
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E8F79] shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-[#17131F]">
                      Pass real assessment benchmarks (80%+ score)
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E8F79] shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-[#17131F]">
                      Attach verifiable proof directly to your Skill Profile
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E8F79] shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-[#17131F]">
                      Qualify for direct employer introductions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#17131F]">
                  Course Curriculum
                </h2>
                <span className="font-mono text-xs text-[#6E6678]">
                  {lessonCount} structured module{lessonCount > 1 ? "s" : ""}
                </span>
              </div>

              {lessonCount > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <LessonRow key={lesson.id} lesson={lesson} index={index} />
                  ))}
                </div>
              ) : (
                <Card variant="surface" className="text-center p-8">
                  <p className="font-sans text-sm text-[#6E6678]">
                    Curriculum modules are being finalized for this course.
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(30,91,255,0.06)] space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678]">
                  Track Access
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-[#17131F]">
                    Free in Ecosystem
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/courses/${course.id}/learn`} className="w-full block">
                  <Button size="lg" fullWidth leftIcon={<Play className="w-4 h-4 fill-current" />}>
                    Start Learning Now
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-[#D9CEDF]/60 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-[#6E6678] font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                  <span>Interactive quizzes and test suites</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#6E6678] font-sans">
                  <Award className="w-4 h-4 text-[#2E8F79] shrink-0" />
                  <span>Digital verified credential on completion</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#6E6678] font-sans">
                  <Clock className="w-4 h-4 text-[#6E6678] shrink-0" />
                  <span>Self-paced with progress tracking</span>
                </div>
              </div>
            </div>

            {/* Proof Card */}
            <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#1E5BFF]">
                <Award className="w-5 h-5" />
                <span className="font-display font-bold text-sm">
                  Verified Credential
                </span>
              </div>
              <p className="font-sans text-xs text-[#6E6678] leading-relaxed">
                Completing this course and passing its assessment issues a cryptographic certificate record verified by Blih Ops.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-12">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <Link href="/courses" className="hover:text-[#1E5BFF] transition-colors uppercase tracking-wider">
          All Courses
        </Link>
      </footer>
    </div>
  );
}