import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <header className="bg-white border-b border-[#D9CEDF] sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link href={`/courses/${courseId}`}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Course
            </Button>
          </Link>
          <div className="hidden sm:block h-5 w-[1px] bg-[#D9CEDF]" />
          <div className="min-w-0">
            <h2 className="font-display font-bold text-base sm:text-lg text-[#17131F] truncate max-w-xs sm:max-w-md">
              {courseTitle || "Course Workspace"}
            </h2>
            <p className="font-mono text-xs text-[#6E6678] truncate">
              Lesson {activeLessonIndex + 1} of {totalLessons} ·{" "}
              {activeLessonTitle || "Overview"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-xs text-[#6E6678]">Progress:</span>
            <div className="w-20 sm:w-32 bg-[#EEF3FF] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-[#2E8F79]" : "bg-[#1E5BFF]"
                  }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span
              className={`font-mono text-xs font-bold ${isComplete ? "text-[#2E8F79]" : "text-[#1E5BFF]"
                }`}
            >
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
