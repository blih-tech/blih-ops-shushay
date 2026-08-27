"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  FileText,
  HelpCircle,
  Code,
  Award,
  ChevronRight,
  Sparkles,
  BookOpen,
  Volume2,
  Maximize2,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  Button,
  Badge,
  Card,
  GlobalNavbar,
  Alert,
  SkillBar,
} from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { fetchPublicCourse } from "@/lib/courses";
import type { PublicCourse, PublicLesson } from "@/types/course";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

function LearnContent({ courseId }: { courseId: string }) {
  const { user, logout } = useAuth();
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"video" | "reading" | "quiz" | "exercise">("video");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]);

  useEffect(() => {
    fetchPublicCourse(courseId)
      .then((data) => {
        setCourse(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  const activeLesson = course?.lessons?.[activeLessonIndex];
  const totalLessons = course?.lessons?.length || 1;
  const progressPercent = Math.round(((completedLessons.length) / totalLessons) * 100);

  const handleCompleteCurrent = () => {
    if (!completedLessons.includes(activeLessonIndex)) {
      setCompletedLessons([...completedLessons, activeLessonIndex]);
    }
    if (activeLessonIndex + 1 < totalLessons) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased">
      {/* Workspace Header */}
      <header className="bg-white border-b border-[#D9CEDF] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${courseId}`}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Course
            </Button>
          </Link>
          <div className="hidden sm:block h-5 w-[1px] bg-[#D9CEDF]" />
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg text-[#17131F] truncate max-w-md">
              {course?.title || "Course Workspace"}
            </h1>
            <p className="font-mono text-xs text-[#6E6678]">
              Lesson {activeLessonIndex + 1} of {totalLessons} · {activeLesson?.title || "Overview"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="font-mono text-xs text-[#6E6678]">Progress:</span>
            <div className="w-32 bg-[#EEF3FF] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1E5BFF] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-[#1E5BFF]">
              {progressPercent}%
            </span>
          </div>

          <Link href="/certificates">
            <Button variant="outline" size="sm" leftIcon={<Award className="w-4 h-4 text-[#2E8F79]" />}>
              Credential Status
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] w-full mx-auto">
        {/* Left / Center: Interactive Content Player */}
        <div className="lg:col-span-8 p-4 sm:p-8 space-y-6 overflow-y-auto">
          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#D9CEDF]">
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeTab === "video"
                  ? "bg-[#1E5BFF] text-white"
                  : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Video Masterclass</span>
            </button>
            <button
              onClick={() => setActiveTab("reading")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeTab === "reading"
                  ? "bg-[#1E5BFF] text-white"
                  : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Architecture & Theory</span>
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-[#1E5BFF] text-white"
                  : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Assessment Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab("exercise")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeTab === "exercise"
                  ? "bg-[#1E5BFF] text-white"
                  : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Practical Exercise</span>
            </button>
          </div>

          {/* Player Surface */}
          {activeTab === "video" && (
            <div className="space-y-6">
              <div className="w-full aspect-video bg-[#17131F] rounded-3xl overflow-hidden shadow-xl relative flex flex-col justify-between p-6 text-white">
                <div className="flex items-center justify-between text-white/80">
                  <Badge variant="dark" size="sm">
                    {course?.title}
                  </Badge>
                  <span className="font-mono text-xs">HD 1080p</span>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#1E5BFF] hover:bg-[#1546CC] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 text-white fill-current ml-1" />
                  </div>
                  <p className="font-display font-bold text-lg text-center">
                    {activeLesson?.title || "Lesson Video"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-white/70">
                  <span>04:15 / 18:30</span>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 cursor-pointer" />
                    <Maximize2 className="w-4 h-4 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-xl font-bold text-[#17131F]">
                  Lesson Objective
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#6E6678] leading-relaxed">
                  In this module, you will understand the fundamental principles, design patterns, and state requirements necessary to meet enterprise quality benchmarks.
                </p>
              </div>
            </div>
          )}

          {activeTab === "reading" && (
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                {activeLesson?.title || "Deep Dive & Conceptual Brief"}
              </h2>
              <div className="prose max-w-none text-[#17131F] font-sans space-y-4 leading-relaxed">
                <p className="text-base text-[#6E6678]">
                  Production systems require high reliability, test coverage, and clear component boundaries. When architecting your solution:
                </p>
                <div className="bg-[#EEF3FF] border-l-4 border-[#1E5BFF] p-4 rounded-r-2xl text-sm font-sans space-y-1">
                  <strong className="text-[#17131F] block">Core Architectural Rule:</strong>
                  <p className="text-[#6E6678]">
                    Always separate business logic and side effects from pure rendering layers. This makes validation, automated testing, and verification straightforward.
                  </p>
                </div>
                <p className="text-base text-[#6E6678]">
                  Review the implementation guidelines and proceed to the verification quiz below once you have understood the patterns.
                </p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9CEDF]/60">
                <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
                  Competency Verification
                </span>
                <Badge variant="primary" size="sm">
                  Required: 80%+
                </Badge>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#17131F]">
                What is the primary benefit of decoupled architecture in scalable applications?
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  "It eliminates all backend network latency automatically.",
                  "It isolates side effects, simplifies testing, and increases long-term maintainability.",
                  "It removes the need for TypeScript type safety.",
                  "It allows writing unstructured monolithic code without consequences.",
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border font-sans text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${
                      selectedQuizOption === idx
                        ? "border-[#1E5BFF] bg-[#DDE7FF]/50 text-[#1E5BFF] font-medium"
                        : "border-[#D9CEDF] bg-white text-[#17131F] hover:bg-[#EEF3FF]"
                    }`}
                  >
                    <span>{option}</span>
                    <span className="w-5 h-5 rounded-full border border-[#D9CEDF] flex items-center justify-center text-xs font-mono">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                ))}
              </div>

              {quizSubmitted ? (
                <div className="space-y-4 pt-2">
                  <Alert variant={selectedQuizOption === 1 ? "success" : "error"}>
                    {selectedQuizOption === 1
                      ? "Correct! Isolating side effects ensures robust testability and modularity."
                      : "Incorrect. The correct answer is B: It isolates side effects and increases testability."}
                  </Alert>
                </div>
              ) : (
                <div className="pt-2">
                  <Button
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                    variant="primary"
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "exercise" && (
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9CEDF]/60">
                <h3 className="font-display text-xl font-bold text-[#17131F]">
                  Practical Exercise Workspace
                </h3>
                <Badge variant="verified" size="sm">
                  Automated Test Runner
                </Badge>
              </div>

              <div className="bg-[#17131F] rounded-2xl p-4 font-mono text-xs text-white space-y-2">
                <div className="text-[#2E8F79]">✓ Test 1: Component renders with correct props (12ms)</div>
                <div className="text-[#2E8F79]">✓ Test 2: Handles async state transitions cleanly (24ms)</div>
                <div className="text-[#2E8F79]">✓ Test 3: Type safety contracts pass strict validation (8ms)</div>
                <div className="pt-2 text-white/50">All 3 unit test suites passed successfully.</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-[#2E8F79] font-medium">
                  Status: 100% Passing
                </span>
                <Button variant="coral" size="sm">
                  Re-run Test Suite
                </Button>
              </div>
            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="pt-6 border-t border-[#D9CEDF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              disabled={activeLessonIndex === 0}
              onClick={() => {
                setActiveLessonIndex(Math.max(0, activeLessonIndex - 1));
                setSelectedQuizOption(null);
                setQuizSubmitted(false);
              }}
            >
              Previous Lesson
            </Button>

            <Button
              variant="primary"
              onClick={handleCompleteCurrent}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {activeLessonIndex + 1 === totalLessons
                ? "Complete Course & Generate Certificate"
                : "Mark Complete & Continue"}
            </Button>
          </div>
        </div>

        {/* Right Sidebar: Course Modules & Lesson Outline */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#D9CEDF] p-4 sm:p-6 space-y-6 bg-[#EEF3FF]/40">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-[#17131F]">
              Module Curriculum
            </h2>
            <p className="font-mono text-xs text-[#6E6678]">
              {completedLessons.length} of {totalLessons} completed
            </p>
          </div>

          <div className="space-y-2.5">
            {course?.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, idx) => {
                const isActive = idx === activeLessonIndex;
                const isCompleted = completedLessons.includes(idx);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setSelectedQuizOption(null);
                      setQuizSubmitted(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-white border-[#1E5BFF] shadow-sm text-[#1E5BFF]"
                        : "bg-white/80 border-[#D9CEDF] hover:bg-white text-[#17131F]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isCompleted
                            ? "bg-[#E6F5F0] text-[#2E8F79]"
                            : isActive
                            ? "bg-[#1E5BFF] text-white"
                            : "bg-[#EEF3FF] text-[#6E6678]"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="font-sans text-xs sm:text-sm font-medium truncate">
                        {lesson.title}
                      </span>
                    </div>

                    {isCompleted && (
                      <Badge variant="verified" size="sm">
                        Done
                      </Badge>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-[#D9CEDF] text-center text-xs font-mono text-[#6E6678]">
                Lesson 1: Introduction & Architecture Setup
              </div>
            )}
          </div>

          {/* Skill Evidence Added Notice */}
          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#1E5BFF]">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Evidence Impact
              </span>
            </div>
            <p className="font-sans text-xs text-[#6E6678] leading-relaxed">
              Completing all quizzes and exercises in this track will add a verified capability badge to your public Blih Talent profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <LearnContent courseId={resolvedParams.courseId} />
    </AuthGuard>
  );
}
