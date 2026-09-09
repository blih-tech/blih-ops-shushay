"use client";

import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@blih/ui";
import type { PublicLesson } from "@/types/course";

interface LearnCurriculumSidebarProps {
  lessons: PublicLesson[];
  activeLessonIndex: number;
  completedLessons: number[];
  onSelectLesson: (index: number) => void;
}

export function LearnCurriculumSidebar({
  lessons,
  activeLessonIndex,
  completedLessons,
  onSelectLesson,
}: LearnCurriculumSidebarProps) {
  const totalLessons = lessons?.length || 1;

  return (
    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#D9CEDF] p-4 sm:p-6 lg:p-8 space-y-6 bg-[#EEF3FF]">
      <div className="space-y-1">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F] tracking-tight">
          Course structure
        </h2>
        <p className="font-mono text-xs text-[#6E6678]">
          {completedLessons.length} of {totalLessons} modules completed
        </p>
      </div>

      <div className="space-y-2.5">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson: PublicLesson, idx: number) => {
            const isActive = idx === activeLessonIndex;
            const isCompleted = completedLessons.includes(idx);
            const lessonNum = (idx + 1).toString().padStart(2, "0");
            return (
              <button
                key={lesson.id || idx}
                onClick={() => onSelectLesson(idx)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? "bg-white border-[#1E5BFF] shadow-md text-[#1E5BFF] ring-2 ring-[#1E5BFF]/10"
                    : "bg-white/90 border-[#D9CEDF] hover:bg-white text-[#17131F]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isCompleted
                        ? "bg-[#2E8F79]/10 text-[#2E8F79]"
                        : isActive
                          ? "bg-[#1E5BFF] text-white shadow-xs"
                          : "bg-[#EEF3FF] text-[#6E6678]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    ) : (
                      lessonNum
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-sans text-xs sm:text-sm font-medium block truncate">
                      {lesson.title}
                    </span>
                    {isActive && (
                      <span className="font-mono text-[10px] text-[#1E5BFF] font-semibold block mt-0.5">
                        · current
                      </span>
                    )}
                  </div>
                </div>

                {isCompleted && (
                  <Badge variant="verified" size="sm">
                    ✓
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
          Completing all quizzes and exercises in this track will add a verified
          capability badge to your public Blih Talent profile.
        </p>
      </div>
    </div>
  );
}
