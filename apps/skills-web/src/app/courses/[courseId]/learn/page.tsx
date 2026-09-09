"use client";

import React, { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Loader2, Trophy } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, Alert } from "@blih/ui";
import { fetchProtectedCourse } from "@/lib/courses";
import {
  initializeSkillsPayment,
  getCourseProgress,
  markLessonComplete,
  submitQuiz,
  submitAssignment,
} from "@blih/api-client";
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
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [assignmentContent, setAssignmentContent] = useState("");
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  const refreshProgress = useCallback(
    (lessons: PublicLesson[]) => {
      getCourseProgress(courseId)
        .then((progressData) => {
          if (progressData?.completedLessonIds) {
            const indices = progressData.completedLessonIds
              .map((id: string) => lessons.findIndex((l) => l.id === id))
              .filter((i: number) => i !== -1);
            setCompletedLessons(indices);
          }
        })
        .catch(console.error);
    },
    [courseId],
  );

  useEffect(() => {
    fetchProtectedCourse(courseId)
      .then((data) => {
        const publicCourse = data as unknown as PublicCourse;
        setCourse(publicCourse);
        refreshProgress(publicCourse.lessons);
      })
      .catch((err) => {
        if (err.status === 403 || err.message?.includes("payment")) {
          setAccessDenied(true);
        }
      })
      .finally(() => setLoading(false));
  }, [courseId, refreshProgress]);

  // Reset quiz/assignment state when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(null);
    setQuizScore(null);
    setAssignmentContent("");
    setAssignmentFile(null);
    setAssignmentSubmitted(false);
    setAssignmentError(null);
    setCompletionError(null);
  }, [activeLessonIndex]);

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
                Full lesson content, video streams, downloadable resources, and
                quizzes are protected. Make a one-time{" "}
                <strong className="text-[#17131F]">1,000 ETB</strong> payment
                via Chapa to permanently unlock all current and future Blih
                Skills courses.
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
  const isCourseComplete =
    totalLessons > 0 && completedLessons.length === totalLessons;

  const handleCompleteCurrent = async () => {
    if (!activeLesson) return;
    setIsMarkingComplete(true);
    setCompletionError(null);
    try {
      await markLessonComplete(activeLesson.id);
      if (!completedLessons.includes(activeLessonIndex)) {
        setCompletedLessons((prev) => [...prev, activeLessonIndex]);
      }
      if (activeLessonIndex + 1 < totalLessons) {
        setActiveLessonIndex(activeLessonIndex + 1);
      }
    } catch (e: any) {
      // If lesson requires quiz/assignment, show the appropriate error
      setCompletionError(e.message || "Could not mark lesson complete");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!activeLesson?.quiz) return;
    const questions = ((activeLesson.quiz as any).questions as any[]) ?? [];
    if (Object.keys(quizAnswers).length !== questions.length) return;
    const answers = questions.map((_: any, i: number) => quizAnswers[i] ?? 0);
    try {
      const result = await submitQuiz(activeLesson.quiz.id, answers);
      setQuizSubmitted(true);
      setQuizPassed(result.passed);
      setQuizScore(result.score);
      if (result.passed && !completedLessons.includes(activeLessonIndex)) {
        setCompletedLessons((prev) => [...prev, activeLessonIndex]);
      }
    } catch (e: any) {
      setCompletionError(e.message || "Failed to submit quiz");
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!activeLesson?.assignment) return;
    if (!assignmentContent && !assignmentFile) {
      setAssignmentError("Please provide a text response or upload a file.");
      return;
    }
    setIsSubmittingAssignment(true);
    setAssignmentError(null);
    try {
      await submitAssignment(
        activeLesson.assignment.id,
        assignmentContent || undefined,
        assignmentFile || undefined,
      );
      setAssignmentSubmitted(true);
      if (!completedLessons.includes(activeLessonIndex)) {
        setCompletedLessons((prev) => [...prev, activeLessonIndex]);
      }
    } catch (e: any) {
      setAssignmentError(e.message || "Failed to submit assignment");
    } finally {
      setIsSubmittingAssignment(false);
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

      {/* Course Completion Banner */}
      {isCourseComplete && (
        <div className="bg-gradient-to-r from-[#00A859] to-[#2E8F79] text-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-display font-bold text-base">
                🎉 Course Complete!
              </p>
              <p className="text-sm text-white/80">
                You&apos;ve completed all {totalLessons} lessons in{" "}
                {course?.title}.
              </p>
            </div>
          </div>
          <Link href={`/certificates?courseId=${course?.id}`}>
            <Button variant="secondary" size="sm">
              View Certificate
            </Button>
          </Link>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] w-full mx-auto">
        <LearnPlayerSurface
          courseTitle={course?.title}
          activeLesson={activeLesson}
          activeLessonIndex={activeLessonIndex}
          onNextLesson={() => {
            if (activeLessonIndex + 1 < totalLessons) {
              setActiveLessonIndex(activeLessonIndex + 1);
            }
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedQuizOption={quizAnswers}
          setSelectedQuizOption={(qIdx: number, optIdx: number) =>
            setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
          }
          quizSubmitted={quizSubmitted}
          quizPassed={quizPassed}
          quizScore={quizScore}
          onSubmitQuiz={handleQuizSubmit}
          assignmentContent={assignmentContent}
          setAssignmentContent={setAssignmentContent}
          assignmentFile={assignmentFile}
          setAssignmentFile={setAssignmentFile}
          assignmentSubmitted={assignmentSubmitted}
          assignmentError={assignmentError}
          onSubmitAssignment={handleAssignmentSubmit}
          isSubmittingAssignment={isSubmittingAssignment}
          onCompleteLesson={handleCompleteCurrent}
          isMarkingComplete={isMarkingComplete}
          completionError={completionError}
          isCurrentLessonComplete={completedLessons.includes(activeLessonIndex)}
        />

        <LearnCurriculumSidebar
          lessons={lessonsList}
          activeLessonIndex={activeLessonIndex}
          completedLessons={completedLessons}
          onSelectLesson={(idx) => {
            setActiveLessonIndex(idx);
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
