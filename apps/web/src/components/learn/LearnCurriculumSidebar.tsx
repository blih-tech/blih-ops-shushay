"use client";

import React from "react";
import {
  CheckCircle2,
  Sparkles,
  Play,
  FileText,
  HelpCircle,
  Code,
  Layers,
} from "lucide-react";
import { Badge } from "@blih/ui";
import type { PublicLesson, CourseStep } from "@/types/course";

interface LearnCurriculumSidebarProps {
  lessons: PublicLesson[];
  steps: CourseStep[];
  activeStepIndex: number;
  completedLessons: number[];
  onSelectStep: (stepIndex: number) => void;
}

export function LearnCurriculumSidebar({
  lessons,
  steps,
  activeStepIndex,
  completedLessons,
  onSelectStep,
}: LearnCurriculumSidebarProps) {
  const totalLessons = lessons?.length || 1;
  const totalSteps = steps?.length || 1;
  const completedStepsCount = steps.filter((s) =>
    completedLessons.includes(s.lessonIndex),
  ).length;

  return (
    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#D9CEDF]/80 p-4 sm:p-6 lg:p-7 space-y-6 bg-white">
      {/* Sidebar Top Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#17131F]">
          <Layers className="w-4 h-4" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            Curriculum Structure
          </span>
        </div>
        <h2 className="font-display text-2xl font-extrabold text-[#17131F] tracking-tight">
          Course Modules & Steps
        </h2>
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 bg-[#D9CEDF]/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1E5BFF] h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-mono text-[11px] font-semibold text-[#6E6678] shrink-0">
            {completedStepsCount}/{totalSteps} Steps
          </span>
        </div>
      </div>

      {/* Module Cards List */}
      <div className="space-y-3.5">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson: PublicLesson, lIdx: number) => {
            const lessonSteps = steps.filter((s) => s.lessonIndex === lIdx);
            const isLessonCompleted = completedLessons.includes(lIdx);
            const lessonNum = (lIdx + 1).toString().padStart(2, "0");

            return (
              <div
                key={lesson.id || lIdx}
                className={`bg-white border transition-all rounded-2xl p-4 space-y-2.5 shadow-2xs hover:shadow-md ${
                  isLessonCompleted
                    ? "border-[#B0E8CA]/80 bg-white"
                    : "border-[#D9CEDF]/80"
                }`}
              >
                {/* Module Title Header */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8E1EE]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#17131F] bg-white border border-[#D9CEDF] px-2 py-0.5 rounded-md shrink-0 shadow-2xs">
                      Module {lessonNum}
                    </span>
                    <h3 className="font-display text-sm font-bold text-[#17131F] truncate">
                      {lesson.title}
                    </h3>
                  </div>
                  {isLessonCompleted && (
                    <Badge variant="verified" size="sm" className="shrink-0">
                      ✓ Completed
                    </Badge>
                  )}
                </div>

                {/* Steps List */}
                <div className="space-y-1.5">
                  {lessonSteps.map((step) => {
                    const stepGlobalIndex = steps.findIndex(
                      (s) => s.id === step.id,
                    );
                    const isActive = stepGlobalIndex === activeStepIndex;

                    const getStepConfig = () => {
                      switch (step.type) {
                        case "video":
                          return {
                            icon: <Play className="w-3.5 h-3.5 shrink-0" />,
                            badge: "Video",
                            activeBg: "bg-[#1E5BFF] text-white shadow-xs",
                            inactiveIconColor: "text-[#1E5BFF]",
                          };
                        case "reading":
                          return {
                            icon: <FileText className="w-3.5 h-3.5 shrink-0" />,
                            badge: "Reading",
                            activeBg: "bg-[#00A859] text-white shadow-xs",
                            inactiveIconColor: "text-[#00A859]",
                          };
                        case "quiz":
                          return {
                            icon: <HelpCircle className="w-3.5 h-3.5 shrink-0" />,
                            badge: "Quiz",
                            activeBg: "bg-[#D97706] text-white shadow-xs",
                            inactiveIconColor: "text-[#D97706]",
                          };
                        case "exercise":
                          return {
                            icon: <Code className="w-3.5 h-3.5 shrink-0" />,
                            badge: "Task",
                            activeBg: "bg-[#1E5BFF] text-white shadow-xs",
                            inactiveIconColor: "text-[#1E5BFF]",
                          };
                      }
                    };

                    const config = getStepConfig();

                    return (
                      <button
                        key={step.id}
                        onClick={() => onSelectStep(stepGlobalIndex)}
                        aria-current={isActive ? "step" : undefined}
                        className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 text-xs font-medium group ${
                          isActive
                            ? `${config.activeBg} font-semibold ring-2 ring-black/5`
                            : "bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#17131F] border border-transparent hover:border-[#C5D7FF]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={
                              isActive ? "text-white" : config.inactiveIconColor
                            }
                          >
                            {config.icon}
                          </span>
                          <span className="truncate">{step.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isLessonCompleted ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${
                                isActive ? "text-white" : "text-[#2E8F79]"
                              }`}
                            />
                          ) : (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[#EEF3FF] text-[#6E6678]"
                              }`}
                            >
                              {config.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 bg-white rounded-2xl border border-[#D9CEDF] text-center text-xs font-mono text-[#6E6678]">
            No curriculum steps available.
          </div>
        )}
      </div>

      {/* Skill Evidence Added Notice */}
      <div className="bg-white border border-[#D9CEDF] rounded-2xl p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#1E5BFF]">
          <Sparkles className="w-4 h-4" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            Verified Skill Evidence
          </span>
        </div>
        <p className="font-sans text-xs text-[#6E6678] leading-relaxed">
          Completing all step requirements, quizzes, and practical exercises in this course track will issue a verified capability certificate on your profile.
        </p>
      </div>
    </div>
  );
}
