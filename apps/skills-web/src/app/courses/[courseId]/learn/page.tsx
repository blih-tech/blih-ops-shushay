"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Loader2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, Alert } from "@blih/ui";
import { fetchProtectedCourse } from "@/lib/courses";
import { initializeSkillsPayment } from "@blih/api-client";
import { LearnHeader } from "@/components/learn/LearnHeader";
import { LearnCurriculumSidebar } from "@/components/learn/LearnCurriculumSidebar";
import { LearnPlayerSurface } from "@/components/learn/LearnPlayerSurface";
import type { PublicCourse, PublicLesson } from "@/types/course";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

function LearnContent({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "video" | "reading" | "quiz" | "exercise"
  >("video");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(
    null,
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]);

  useEffect(() => {
    fetchProtectedCourse(courseId)
      .then((data) => {
        setCourse(data as unknown as PublicCourse);
      })

      .catch((err) => {
        if (err.status === 403 || err.message?.includes("payment")) {
          setAccessDenied(true);
        }
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleUnlockClick = async () => {
    try {
      setInitiatingPayment(true);
      setPaymentError(null);
      const res = await initializeSkillsPayment();
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initialize payment");
    } finally {
      setInitiatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <div className="bg-white border border-[#D9CEDF] shadow-xl rounded-2xl p-8 space-y-6">
            <div className="w-16 h-16 bg-[#EEF3FF] rounded-full flex items-center justify-center mx-auto border border-[#C5D7FF]">
              <Sparkles className="w-8 h-8 text-[#1E5BFF]" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-[#17131F]">
                Skills Access Required
              </h1>
              <p className="text-[#6E6678] text-sm leading-relaxed">
                Full lesson content, video streams, downloadable resources, and quizzes are protected. Make a one-time <strong className="text-[#17131F]">1,000 ETB</strong> payment via Chapa to permanently unlock all current and future Blih Skills courses.
              </p>
            </div>

            {paymentError && (
              <Alert variant="error" className="text-xs text-left">
                {paymentError}
              </Alert>
            )}

            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleUnlockClick}
                isLoading={initiatingPayment}
              >
                <span>Unlock All Courses (1,000 ETB)</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>

              <Link href={`/courses/${courseId}`} className="block">
                <Button variant="ghost" size="sm" className="w-full">
                  Return to Course Overview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lessonsList: PublicLesson[] = course?.lessons || [];
  const activeLesson = lessonsList[activeLessonIndex];
  const totalLessons = lessonsList.length || 1;
  const progressPercent = Math.round(
    (completedLessons.length / totalLessons) * 100,
  );

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
      <LearnHeader
        courseId={courseId}
        courseTitle={course?.title}
        activeLessonTitle={activeLesson?.title}
        activeLessonIndex={activeLessonIndex}
        totalLessons={totalLessons}
        progressPercent={progressPercent}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] w-full mx-auto">
        <LearnPlayerSurface
          courseTitle={course?.title}
          activeLesson={activeLesson}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedQuizOption={selectedQuizOption}
          setSelectedQuizOption={setSelectedQuizOption}
          quizSubmitted={quizSubmitted}
          setQuizSubmitted={setQuizSubmitted}
          onCompleteLesson={handleCompleteCurrent}
        />

        <LearnCurriculumSidebar
          lessons={lessonsList}
          activeLessonIndex={activeLessonIndex}
          completedLessons={completedLessons}
          onSelectLesson={(idx) => {
            setActiveLessonIndex(idx);
            setSelectedQuizOption(null);
            setQuizSubmitted(false);
          }}
        />
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
