"use client";

import React from "react";
import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@blih/ui";

interface LearnFooterBarProps {
  hasQuiz: boolean;
  hasAssignment: boolean;
  isCurrentLessonComplete: boolean;
  isMarkingComplete: boolean;
  completionError: string | null;
  onCompleteLesson: () => void;
}

export function LearnFooterBar({
  hasQuiz,
  hasAssignment,
  isCurrentLessonComplete,
  isMarkingComplete,
  completionError,
  onCompleteLesson,
}: LearnFooterBarProps) {
  return (
    <div className="pt-4 border-t border-[#D9CEDF] flex flex-wrap items-center justify-between gap-4">
      {isCurrentLessonComplete ? (
        <div className="flex items-center gap-2 text-[#2E8F79]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-sans text-sm font-medium">Lesson Complete</span>
        </div>
      ) : !hasQuiz && !hasAssignment ? (
        <Button
          variant="secondary"
          size="md"
          leftIcon={
            isMarkingComplete ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#00A859]" />
            )
          }
          onClick={onCompleteLesson}
          disabled={isMarkingComplete}
        >
          {isMarkingComplete ? "Saving..." : "Mark Lesson Complete & Continue"}
        </Button>
      ) : (
        <p className="text-xs font-mono text-[#6E6678]">
          {hasQuiz
            ? "Complete the quiz above to mark this lesson done."
            : "Submit your assignment above to mark this lesson done."}
        </p>
      )}

      {completionError && (
        <div className="flex items-center gap-2 text-[#CC3333] text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{completionError}</span>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        rightIcon={<ArrowRight className="w-4 h-4" />}
        onClick={onCompleteLesson}
        disabled={isMarkingComplete}
      >
        Skip to Next Lesson
      </Button>
    </div>
  );
}
