"use client";

import React from "react";
import {
  Play,
  FileText,
  HelpCircle,
  Code,
  Volume2,
  Maximize2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button, Badge } from "@blih/ui";
import type { PublicLesson } from "@/types/course";

interface LearnPlayerSurfaceProps {
  courseTitle?: string;
  activeLesson?: PublicLesson;
  activeTab: "video" | "reading" | "quiz" | "exercise";
  setActiveTab: (tab: "video" | "reading" | "quiz" | "exercise") => void;
  selectedQuizOption: number | null;
  setSelectedQuizOption: (opt: number | null) => void;
  quizSubmitted: boolean;
  setQuizSubmitted: (submitted: boolean) => void;
  onCompleteLesson: () => void;
}

export function LearnPlayerSurface({
  courseTitle,
  activeLesson,
  activeTab,
  setActiveTab,
  selectedQuizOption,
  setSelectedQuizOption,
  quizSubmitted,
  setQuizSubmitted,
  onCompleteLesson,
}: LearnPlayerSurfaceProps) {
  return (
    <div className="lg:col-span-8 p-4 sm:p-8 space-y-6 overflow-y-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#D9CEDF]">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeTab === "video"
              ? "bg-[#1E5BFF] text-white"
              : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Video Masterclass</span>
        </button>
        <button
          onClick={() => setActiveTab("reading")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeTab === "reading"
              ? "bg-[#1E5BFF] text-white"
              : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Architecture & Theory</span>
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeTab === "quiz"
              ? "bg-[#1E5BFF] text-white"
              : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Assessment Quiz</span>
        </button>
        <button
          onClick={() => setActiveTab("exercise")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeTab === "exercise"
              ? "bg-[#1E5BFF] text-white"
              : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF]"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Practical Exercise</span>
        </button>
      </div>

      {/* Video Masterclass */}
      {activeTab === "video" && (
        <div className="space-y-6">
          <div className="w-full aspect-video bg-[#17131F] rounded-3xl overflow-hidden shadow-xl relative flex flex-col justify-between p-6 text-white">
            <div className="flex items-center justify-between text-white/80">
              <Badge variant="dark" size="sm">
                {courseTitle}
              </Badge>
              <span className="font-mono text-xs">HD 1080p</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1E5BFF] hover:bg-[#1546CC] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                <Play className="w-7 h-7 text-white fill-current ml-1" />
              </div>
              <p className="font-display font-bold text-lg text-center">
                {activeLesson?.title || "Lesson Video"}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-white/70">
              <span>04:15 / 18:30</span>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 cursor-pointer" />
                <Maximize2 className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-display text-xl font-bold text-[#17131F]">
              Lesson Objective
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#6E6678] leading-relaxed">
              In this module, you will understand the fundamental principles, design patterns, and state requirements necessary to meet enterprise quality benchmarks.
            </p>
          </div>
        </div>
      )}

      {/* Architecture & Theory Reading */}
      {activeTab === "reading" && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
            {activeLesson?.title || "Deep Dive & Conceptual Brief"}
          </h2>
          <div className="prose max-w-none text-[#17131F] font-sans space-y-4 leading-relaxed">
            <p className="text-base text-[#6E6678]">
              Production systems require high reliability, test coverage, and clear component boundaries. When architecting your solution:
            </p>
            <div className="bg-[#EEF3FF] border-l-4 border-[#1E5BFF] p-4 rounded-r-2xl text-sm font-sans space-y-1">
              <strong className="text-[#17131F] block">
                Core Architectural Rule:
              </strong>
              <span>
                Always keep data fetching side-effects decoupled from presentational components. Enforce strict type contracts between client applications and backend APIs.
              </span>
            </div>
            {activeLesson?.content ? (
              <div className="mt-4 p-4 bg-[#F8F6FA] border border-[#E8E1EE] rounded-2xl text-sm font-sans text-[#17131F] whitespace-pre-wrap">
                {activeLesson.content}
              </div>
            ) : (
              <p className="text-sm text-[#6E6678]">
                Review the core syntax, invariants, and function definitions provided in the supplementary document files for this module.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Assessment Quiz */}
      {activeTab === "quiz" && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D9CEDF] pb-4">
            <h3 className="font-display text-xl font-bold text-[#17131F]">
              Knowledge Check
            </h3>
            <Badge variant="secondary" size="sm">
              Single Choice Assessment
            </Badge>
          </div>

          <div className="space-y-4">
            <p className="font-sans text-base font-semibold text-[#17131F]">
              Which pattern ensures clean boundary encapsulation in modern application architecture?
            </p>

            <div className="space-y-2.5">
              {[
                "Global mutable state singleton across all module layers",
                "Strict request context isolation with typed interface contracts",
                "Inlining all SQL execution directly inside frontend event handlers",
                "Disabling runtime parameter validation in production environments",
              ].map((optionText, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() =>
                      !quizSubmitted && setSelectedQuizOption(optIdx)
                    }
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

          {!quizSubmitted ? (
            <Button
              variant="primary"
              size="md"
              disabled={selectedQuizOption === null}
              onClick={() => setQuizSubmitted(true)}
            >
              Submit Answer
            </Button>
          ) : (
            <div className="bg-[#E6F5F0] border border-[#B0E8CA] rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#2E8F79]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-display font-bold text-sm">
                  Correct Answer!
                </span>
              </div>
              <p className="font-sans text-xs text-[#2E8F79]">
                Strict request context isolation ensures safe concurrency and prevents state leakage across execution threads.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Practical Exercise */}
      {activeTab === "exercise" && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Hands-on Exercise & Code Challenge
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Implement the necessary validation logic and type assertion checks for this lesson objective.
          </p>
          <div className="bg-[#17131F] text-emerald-400 font-mono text-xs p-6 rounded-2xl overflow-x-auto space-y-2">
            <p className="text-gray-500">// Task 1: Complete module assertion</p>
            <p>
              <span className="text-purple-400">function</span>{" "}
              <span className="text-blue-400">validateModuleAccess</span>
              (user, entitlement) {"{"}
            </p>
            <p className="pl-4">
              <span className="text-purple-400">if</span> (!user || !entitlement){" "}
              <span className="text-purple-400">return</span> false;
            </p>
            <p className="pl-4">
              <span className="text-purple-400">return</span> entitlement.grantedAt !== null;
            </p>
            <p>{"}"}</p>
          </div>
        </div>
      )}

      {/* Complete & Continue Footer Bar */}
      <div className="pt-4 border-t border-[#D9CEDF] flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="md"
          leftIcon={<CheckCircle2 className="w-4 h-4 text-[#00A859]" />}
          onClick={onCompleteLesson}
        >
          Mark Lesson Complete & Continue
        </Button>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onCompleteLesson}
        >
          Skip to Next Module
        </Button>
      </div>
    </div>
  );
}
