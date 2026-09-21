"use client";

import React from "react";
import { CheckCircle2, AlertCircle, HelpCircle, Trophy } from "lucide-react";
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
  const questions =
    ((activeLesson.quiz as any)?.questions as Array<{
      text: string;
      options: string[];
      correctOptionIndex: number;
    }>) ?? [];

  const answeredCount = Object.keys(selectedQuizOption).length;
  const isAllAnswered = answeredCount === questions.length && questions.length > 0;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#D9CEDF] pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[#17131F]">
              {activeLesson.quiz?.title ?? "Knowledge Check"}
            </h3>
            <p className="font-mono text-xs text-[#6E6678]">
              {questions.length} Question{questions.length === 1 ? "" : "s"} · Minimum 80% passing score
            </p>
          </div>
        </div>

        <Badge variant="secondary" size="sm">
          Assessment Quiz
        </Badge>
      </div>

      {!hasQuiz ? (
        <p className="text-sm text-[#6E6678]">No quiz configured for this step.</p>
      ) : quizSubmitted ? (
        <div
          className={`rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm border ${
            quizPassed
              ? "bg-gradient-to-b from-[#E6F5F0] to-white border-[#B0E8CA]"
              : "bg-gradient-to-b from-[#FFF0F0] to-white border-[#FFC5C5]"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              quizPassed
                ? "bg-[#00A859] text-white shadow-lg shadow-[#00A859]/20"
                : "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20"
            }`}
          >
            {quizPassed ? (
              <Trophy className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h4
              className={`font-display text-2xl font-extrabold ${
                quizPassed ? "text-[#00A859]" : "text-[#EF4444]"
              }`}
            >
              {quizPassed ? "Quiz Passed Successfully!" : "Assessment Not Passed"}
            </h4>
            <p className="font-sans text-sm text-[#6E6678]">
              Your Score:{" "}
              <strong className="text-[#17131F] font-mono text-base">
                {quizScore}%
              </strong>{" "}
              {quizPassed
                ? "— Great work! Step requirement satisfied."
                : "— You need at least 80% to pass."}
            </p>
          </div>

          {!quizPassed && (
            <p className="text-xs text-[#6E6678] bg-white border border-[#D9CEDF] rounded-xl p-3 max-w-md mx-auto">
              Review the material and re-select your options above to re-submit your answers.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question Answered Progress Rail */}
          <div className="flex items-center justify-between gap-4 bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-2xl">
            <span className="font-mono text-xs font-semibold text-[#475569]">
              Answer Progress: {answeredCount} / {questions.length} Selected
            </span>
            <div className="w-28 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1E5BFF] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {questions.map((question, qIdx) => (
            <div
              key={qIdx}
              className="bg-[#F8FAFC]/50 border border-[#E2E8F0] rounded-2xl p-5 space-y-4"
            >
              <p className="font-sans text-sm sm:text-base font-bold text-[#0F172A] flex items-start gap-2">
                <span className="font-mono text-xs bg-[#1E5BFF] text-white px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                  Q{qIdx + 1}
                </span>
                <span>{question.text}</span>
              </p>

              <div
                className="space-y-2.5"
                role="radiogroup"
                aria-label={`Question ${qIdx + 1}`}
              >
                {question.options.map((optionText, optIdx) => {
                  const isSelected = selectedQuizOption[qIdx] === optIdx;
                  const optionLetter = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() =>
                        !quizSubmitted && setSelectedQuizOption(qIdx, optIdx)
                      }
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-[#EEF3FF] border-[#1E5BFF] ring-2 ring-[#1E5BFF]/20 text-[#17131F] shadow-2xs font-medium"
                          : "bg-white border-[#D9CEDF] hover:bg-[#F8F6FA] text-[#475569]"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#1E5BFF] text-white"
                            : "bg-[#EEF3FF] text-[#1E5BFF]"
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span className="font-sans text-sm flex-1">{optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!quizSubmitted && hasQuiz && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
            disabled={!isAllAnswered}
            onClick={onSubmitQuiz}
          >
            Submit Quiz Answers
          </Button>
        </div>
      )}
    </div>
  );
}
