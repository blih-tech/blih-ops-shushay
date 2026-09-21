"use client";

import React from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@blih/ui";
import type { StepType } from "@/types/course";

interface LearnFooterBarProps {
  activeStepIndex: number;
  totalSteps: number;
  currentStepType: StepType;
  isCurrentLessonComplete: boolean;
  isMarkingComplete: boolean;
  completionError: string | null;
  onPrevStep: () => void;
  onNextStep: () => void;
  onCompleteStep: () => void;
}

export function LearnFooterBar({
  activeStepIndex,
  totalSteps,
  currentStepType,
  isCurrentLessonComplete,
  isMarkingComplete,
  completionError,
  onPrevStep,
  onNextStep,
  onCompleteStep,
}: LearnFooterBarProps) {
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === totalSteps - 1;

  const requiresQuiz = currentStepType === "quiz" && !isCurrentLessonComplete;
  const requiresAssignment = currentStepType === "exercise" && !isCurrentLessonComplete;

  return (
    <div className="pt-4 border-t border-[#D9CEDF] flex flex-wrap items-center justify-between gap-4">
      {/* Previous Step */}
      <div>
        {!isFirstStep && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onPrevStep}
          >
            Previous Step
          </Button>
        )}
      </div>

      {/* Status & Errors */}
      <div className="flex items-center gap-3">
        {completionError && (
          <div className="flex items-center gap-2 text-[#EF4444] text-xs font-medium bg-[#FFF0F0] px-3 py-1.5 rounded-lg border border-[#FFC5C5]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{completionError}</span>
          </div>
        )}

        {isCurrentLessonComplete ? (
          <div className="flex items-center gap-1.5 text-[#2E8F79] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Step Done</span>
          </div>
        ) : requiresQuiz ? (
          <span className="text-xs font-mono text-[#6E6678]">
            Complete the quiz above to advance
          </span>
        ) : requiresAssignment ? (
          <span className="text-xs font-mono text-[#6E6678]">
            Submit assignment above to advance
          </span>
        ) : null}
      </div>

      {/* Next Step / Complete */}
      <div className="flex items-center gap-2">
        {isCurrentLessonComplete ? (
          !isLastStep && (
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onNextStep}
            >
              Next Step
            </Button>
          )
        ) : (
          <Button
            variant="primary"
            size="md"
            rightIcon={
              isMarkingComplete ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )
            }
            onClick={onCompleteStep}
            disabled={isMarkingComplete || requiresQuiz || requiresAssignment}
          >
            {isMarkingComplete
              ? "Saving..."
              : isLastStep
                ? "Complete Final Step"
                : "Complete & Next Step"}
          </Button>
        )}
      </div>
    </div>
  );
}
