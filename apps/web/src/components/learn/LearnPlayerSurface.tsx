"use client";

import React from "react";
import { Play, FileText, HelpCircle, Code, ChevronRight } from "lucide-react";
import type { CourseStep } from "@/types/course";
import { LearnVideoPlayer } from "./LearnVideoPlayer";
import { LearnReadingStep } from "./LearnReadingStep";
import { LearnQuizStep } from "./LearnQuizStep";
import { LearnAssignmentStep } from "./LearnAssignmentStep";
import { LearnFooterBar } from "./LearnFooterBar";

interface LearnPlayerSurfaceProps {
  courseTitle?: string;
  activeStep?: CourseStep;
  activeStepIndex: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  selectedQuizOption: Record<number, number>;
  setSelectedQuizOption: (qIdx: number, optIdx: number) => void;
  quizSubmitted: boolean;
  quizPassed: boolean | null;
  quizScore: number | null;
  onSubmitQuiz: () => void;
  assignmentContent: string;
  setAssignmentContent: (content: string) => void;
  assignmentFile: File | null;
  setAssignmentFile: (file: File | null) => void;
  assignmentSubmitted: boolean;
  assignmentError: string | null;
  onSubmitAssignment: () => void;
  isSubmittingAssignment: boolean;
  onCompleteStep: () => void;
  isMarkingComplete: boolean;
  completionError: string | null;
  isCurrentLessonComplete: boolean;
  onRetryQuiz: () => void;
}

export function LearnPlayerSurface({
  activeStep,
  activeStepIndex,
  totalSteps,
  onPrevStep,
  onNextStep,
  selectedQuizOption,
  setSelectedQuizOption,
  quizSubmitted,
  quizPassed,
  quizScore,
  onSubmitQuiz,
  assignmentContent,
  setAssignmentContent,
  assignmentFile,
  setAssignmentFile,
  assignmentSubmitted,
  assignmentError,
  onSubmitAssignment,
  isSubmittingAssignment,
  onCompleteStep,
  isMarkingComplete,
  completionError,
  isCurrentLessonComplete,
  onRetryQuiz,
}: LearnPlayerSurfaceProps) {
  if (!activeStep) {
    return (
      <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-[#D9CEDF] my-4 mx-4">
        <div className="w-14 h-14 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs flex items-center justify-center mb-4">
          <Play className="w-7 h-7 ml-0.5" />
        </div>
        <p className="font-display text-xl font-bold text-[#17131F]">
          Select a step to begin
        </p>
        <p className="text-sm text-[#6E6678] mt-1 max-w-sm">
          Choose a step from the course curriculum sidebar to start learning.
        </p>
      </div>
    );
  }

  const activeLesson = activeStep.lesson;

  const getStepTypeBadge = () => {
    switch (activeStep.type) {
      case "video":
        return {
          icon: <Play className="w-3.5 h-3.5 fill-current" />,
          label: "Video Lecture",
          style: "bg-[#EEF3FF] text-[#1E5BFF] border-[#C5D7FF]",
        };
      case "reading":
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          label: "Reading Material",
          style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "quiz":
        return {
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          label: "Knowledge Check Quiz",
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "exercise":
        return {
          icon: <Code className="w-3.5 h-3.5" />,
          label: "Practical Assessment",
          style: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
    }
  };

  const stepBadge = getStepTypeBadge();

  return (
    <div className="lg:col-span-8 p-4 sm:p-8 space-y-6 overflow-y-auto">
      {/* Step Header Navigation & Breadcrumbs */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6E6678] min-w-0">
            <span className="font-semibold text-[#1E5BFF] shrink-0">
              Module {(activeStep.lessonIndex + 1).toString().padStart(2, "0")}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <span className="truncate">{activeStep.lessonTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded-lg border ${stepBadge.style}`}
            >
              {stepBadge.icon}
              <span>{stepBadge.label}</span>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-white text-[#475569] font-bold border border-[#CBD5E1]">
              Step {activeStepIndex + 1} of {totalSteps}
            </span>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {activeStep.title}
        </h1>
      </div>

      {/* Direct Content Surface Rendering */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeStep.type === "video" && (
          <LearnVideoPlayer
            activeLesson={activeLesson}
            activeLessonIndex={activeStep.lessonIndex}
          />
        )}

        {activeStep.type === "reading" && (
          <LearnReadingStep activeLesson={activeLesson} />
        )}

        {activeStep.type === "quiz" && (
          <LearnQuizStep
            activeLesson={activeLesson}
            selectedQuizOption={selectedQuizOption}
            setSelectedQuizOption={setSelectedQuizOption}
            quizSubmitted={quizSubmitted}
            quizPassed={quizPassed}
            quizScore={quizScore}
            onSubmitQuiz={onSubmitQuiz}
            onRetryQuiz={onRetryQuiz}
          />
        )}

        {activeStep.type === "exercise" && (
          <LearnAssignmentStep
            activeLesson={activeLesson}
            assignmentContent={assignmentContent}
            setAssignmentContent={setAssignmentContent}
            assignmentFile={assignmentFile}
            setAssignmentFile={setAssignmentFile}
            assignmentSubmitted={assignmentSubmitted}
            assignmentError={assignmentError}
            onSubmitAssignment={onSubmitAssignment}
            isSubmittingAssignment={isSubmittingAssignment}
          />
        )}
      </div>

      {/* Footer Navigation & Action Bar */}
      <LearnFooterBar
        activeStepIndex={activeStepIndex}
        totalSteps={totalSteps}
        currentStepType={activeStep.type}
        isCurrentLessonComplete={isCurrentLessonComplete}
        isMarkingComplete={isMarkingComplete}
        completionError={completionError}
        onPrevStep={onPrevStep}
        onNextStep={onNextStep}
        onCompleteStep={onCompleteStep}
      />
    </div>
  );
}
