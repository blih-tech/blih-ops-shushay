"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Badge } from "@blih/ui";
import type { PublicLesson } from "@/types/course";

interface LearnQuizTabProps {
  activeLesson: PublicLesson;
  selectedQuizOption: Record<number, number>;
  setSelectedQuizOption: (qIdx: number, optIdx: number) => void;
  quizSubmitted: boolean;
  quizPassed: boolean | null;
  quizScore: number | null;
  onSubmitQuiz: () => void;
}

export function LearnQuizTab({
  activeLesson,
  selectedQuizOption,
  setSelectedQuizOption,
  quizSubmitted,
  quizPassed,
  quizScore,
  onSubmitQuiz,
}: LearnQuizTabProps) {
  const hasQuiz = !!activeLesson.quiz;
  const questions = ((activeLesson.quiz as any)?.questions as Array<{
    text: string;
    options: string[];
    correctOptionIndex: number;
  }>) ?? [];

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#D9CEDF] pb-4">
        <h3 className="font-display text-xl font-bold text-[#17131F]">
          {activeLesson.quiz?.title ?? "Knowledge Check"}
        </h3>
        <Badge variant="secondary" size="sm">
          Assessment Quiz
        </Badge>
      </div>

      {!hasQuiz ? (
        <p className="text-sm text-[#6E6678]">No quiz for this lesson.</p>
      ) : quizSubmitted ? (
        <div
          className={`rounded-2xl p-5 space-y-2 ${
            quizPassed
              ? "bg-[#E6F5F0] border border-[#B0E8CA]"
              : "bg-[#FFF0F0] border border-[#FFC5C5]"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              quizPassed ? "text-[#2E8F79]" : "text-[#EF4444]"
            }`}
          >
            {quizPassed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-display font-bold text-sm">
              {quizPassed ? "Passed!" : "Not passed — try again"}
            </span>
          </div>
          <p className="font-sans text-xs text-[#17131F]">
            Score: <strong>{quizScore}%</strong>
            {!quizPassed && " — Minimum 80% required to pass."}
          </p>
          {!quizPassed && (
            <p className="text-xs text-[#EF4444] mt-2">
              Navigate away and return to this lesson to retry the quiz.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="font-sans text-base font-semibold text-[#17131F]">
            Answer all questions below.
          </p>
          {questions.map((question, qIdx) => (
            <div key={qIdx} className="space-y-3">
              <p className="font-sans text-sm font-semibold text-[#17131F]">
                {qIdx + 1}. {question.text}
              </p>
              <div
                className="space-y-2.5"
                role="radiogroup"
                aria-label={`Question ${qIdx + 1}`}
              >
                {question.options.map((optionText, optIdx) => {
                  const isSelected = selectedQuizOption[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => !quizSubmitted && setSelectedQuizOption(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-[#EEF3FF] border-[#1E5BFF] ring-2 ring-[#1E5BFF]/20 text-[#17131F]"
                          : "bg-white border-[#D9CEDF] hover:bg-[#F8F6FA] text-[#6E6678]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-[#1E5BFF] bg-[#1E5BFF]"
                            : "border-[#D9CEDF]"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-sans text-sm">{optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!quizSubmitted && hasQuiz && (
        <Button
          variant="primary"
          size="md"
          disabled={Object.keys(selectedQuizOption).length !== questions.length}
          onClick={onSubmitQuiz}
        >
          Submit Answers
        </Button>
      )}
    </div>
  );
}
