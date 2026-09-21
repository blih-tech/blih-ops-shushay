"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Trophy } from "lucide-react";
import { Button } from "@blih/ui";

interface LearnHeaderProps {
  courseId: string;
  courseTitle?: string;
  activeLessonTitle?: string;
  activeLessonIndex: number;
  totalLessons: number;
  progressPercent: number;
}

export function LearnHeader({
  courseId,
  courseTitle,
  activeLessonTitle,
  activeLessonIndex,
  totalLessons,
  progressPercent,
}: LearnHeaderProps) {
  const isComplete = progressPercent === 100;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#D9CEDF]/70 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-2xs transition-all">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href={`/courses/${courseId}`}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4 text-[#1E5BFF]" />}
              className="hover:bg-[#EEF3FF] text-[#17131F] font-medium"
            >
              <span className="hidden sm:inline">Back to Course</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div className="hidden sm:block h-5 w-[1px] bg-[#D9CEDF]" />
          <div className="min-w-0">
            <h2 className="font-display font-bold text-sm sm:text-base text-[#17131F] truncate max-w-xs sm:max-w-md tracking-tight">
              {courseTitle || "Course Workspace"}
            </h2>
            <p className="font-mono text-[11px] text-[#6E6678] truncate">
              Module {activeLessonIndex + 1} of {totalLessons} ·{" "}
              {activeLessonTitle || "Overview"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Progress Widget */}
          <div className="flex items-center gap-2.5 bg-[#F8F6FA] border border-[#E8E1EE] px-3 py-1.5 rounded-full shadow-2xs">
            <span className="hidden md:inline font-mono text-[11px] font-semibold text-[#6E6678] uppercase tracking-wider">
              Course Progress
            </span>
            <div className="w-20 sm:w-28 bg-[#EEF3FF] h-2 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isComplete
                    ? "bg-gradient-to-r from-[#00A859] to-[#2E8F79]"
                    : "bg-gradient-to-r from-[#1E5BFF] to-[#60A5FA]"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              {isComplete ? (
                <Trophy className="w-3.5 h-3.5 text-[#00A859]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#1E5BFF]" />
              )}
              <span
                className={`font-mono text-xs font-bold ${
                  isComplete ? "text-[#00A859]" : "text-[#1E5BFF]"
                }`}
              >
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
