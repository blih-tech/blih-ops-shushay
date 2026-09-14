"use client";

import React from "react";
import { Play, FileText, HelpCircle, Code } from "lucide-react";
import type { PublicLesson } from "@/types/course";
import { LearnVideoPlayer } from "./LearnVideoPlayer";
import { LearnReadingTab } from "./LearnReadingTab";
import { LearnQuizTab } from "./LearnQuizTab";
import { LearnAssignmentTab } from "./LearnAssignmentTab";
import { LearnFooterBar } from "./LearnFooterBar";

interface LearnPlayerSurfaceProps {
  courseTitle?: string;
  activeLesson?: PublicLesson;
  activeLessonIndex?: number;
  onNextLesson?: () => void;
  activeTab: "video" | "reading" | "quiz" | "exercise";
  setActiveTab: (tab: "video" | "reading" | "quiz" | "exercise") => void;
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
  onCompleteLesson: () => void;
  isMarkingComplete: boolean;
  completionError: string | null;
  isCurrentLessonComplete: boolean;
}

export function LearnPlayerSurface({
  activeLesson,
  activeLessonIndex = 0,
  activeTab,
  setActiveTab,
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
  onCompleteLesson,
  isMarkingComplete,
  completionError,
  isCurrentLessonComplete,
}: LearnPlayerSurfaceProps) {
  const hasVideo = !!activeLesson?.videoUrl;
  const hasContent = !!activeLesson?.content;
  const hasQuiz = !!activeLesson?.quiz;
  const hasAssignment = !!activeLesson?.assignment;

  // Determine available tabs
  const tabs = [
    hasVideo && {
      key: "video" as const,
      label: "Video",
      icon: <Play className="w-3.5 h-3.5" />,
    },
    hasContent && {
      key: "reading" as const,
      label: "Reading",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    hasQuiz && {
      key: "quiz" as const,
      label: "Quiz",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
    hasAssignment && {
      key: "exercise" as const,
      label: "Assignment",
      icon: <Code className="w-3.5 h-3.5" />,
    },
  ].filter(Boolean) as {
    key: typeof activeTab;
    label: string;
    icon: React.ReactNode;
  }[];

  const effectiveTab = tabs.find((t) => t.key === activeTab)
    ? activeTab
    : (tabs[0]?.key ?? "video");

  return (
    <div className="lg:col-span-8 p-4 sm:p-8 space-y-6 overflow-y-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#D9CEDF]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
              effectiveTab === tab.key
                ? "bg-[#1E5BFF] text-white"
                : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}

        {tabs.length === 0 && (
          <p className="text-xs font-mono text-[#6E6678]">
            No content tabs configured for this lesson.
          </p>
        )}
      </div>

      {/* Empty State */}
      {!activeLesson && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Play className="w-12 h-12 text-[#D9CEDF] mb-4" />
          <p className="font-display text-lg font-bold text-[#17131F]">
            Select a lesson to begin
          </p>
          <p className="text-sm text-[#6E6678] mt-1">
            Choose a lesson from the curriculum sidebar to start learning.
          </p>
        </div>
      )}

      {/* Tab Panels */}
      {activeLesson && effectiveTab === "video" && (
        <LearnVideoPlayer
          activeLesson={activeLesson}
          activeLessonIndex={activeLessonIndex}
        />
      )}

      {activeLesson && effectiveTab === "reading" && (
        <LearnReadingTab activeLesson={activeLesson} />
      )}

      {activeLesson && effectiveTab === "quiz" && (
        <LearnQuizTab
          activeLesson={activeLesson}
          selectedQuizOption={selectedQuizOption}
          setSelectedQuizOption={setSelectedQuizOption}
          quizSubmitted={quizSubmitted}
          quizPassed={quizPassed}
          quizScore={quizScore}
          onSubmitQuiz={onSubmitQuiz}
        />
      )}

      {activeLesson && effectiveTab === "exercise" && (
        <LearnAssignmentTab
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

      {/* Footer Completion & Action Bar */}
      <LearnFooterBar
        hasQuiz={hasQuiz}
        hasAssignment={hasAssignment}
        isCurrentLessonComplete={isCurrentLessonComplete}
        isMarkingComplete={isMarkingComplete}
        completionError={completionError}
        onCompleteLesson={onCompleteLesson}
      />
    </div>
  );
}
