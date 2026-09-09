'use client'

import React, { useState } from "react";
import { HelpCircle, Plus, Pencil, X, Save } from "lucide-react";
import { Button, Alert, Input } from "@blih/ui";
import { upsertQuiz } from "@/lib/courses";
import type { Lesson, QuizQuestion } from "@/types/course";
import { SectionCard } from "./SectionCard";

interface QuizSectionProps {
  courseId: string;
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
}

export function QuizSection({ courseId, lesson, onUpdate }: QuizSectionProps) {
  const existing = lesson.quiz;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    (existing?.questions as QuizQuestion[] | undefined) ?? [
      { text: "", options: ["", ""], correctOptionIndex: 0 },
    ],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const quiz = await upsertQuiz(courseId, lesson.id, { title, questions });
      onUpdate({ ...lesson, quiz });
      setEditing(false);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && !existing) {
    return (
      <SectionCard
        title="Assessment Quiz"
        icon={<HelpCircle className="h-4 w-4" />}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-[#6E6678]">
            No quiz configured for this lesson.
          </p>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setEditing(true)}
          >
            Add Quiz
          </Button>
        </div>
      </SectionCard>
    );
  }

  if (!editing && existing) {
    return (
      <SectionCard
        title="Assessment Quiz"
        icon={<HelpCircle className="h-4 w-4" />}
      >
        <div className="flex items-center justify-between p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl">
          <div>
            <p className="text-sm font-bold text-[#17131F] font-display">
              {existing.title}
            </p>
            <p className="text-xs font-mono text-[#6E6678]">
              {(existing.questions as QuizQuestion[]).length} Questions
              configured
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => {
              setTitle(existing.title);
              setQuestions(existing.questions as QuizQuestion[]);
              setEditing(true);
            }}
          >
            Edit Quiz
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Assessment Quiz Builder"
      icon={<HelpCircle className="h-4 w-4" />}
    >
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Input
        label="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Chapter Knowledge Check"
      />
      <div className="space-y-4 pt-2">
        {questions.map((q, qi) => (
          <div
            key={qi}
            className="border border-[#D9CEDF] bg-[#EEF3FF]/20 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#1E5BFF] bg-white border border-[#D9CEDF] px-2 py-1 rounded-lg shrink-0">
                Q{qi + 1}
              </span>
              <input
                value={q.text}
                onChange={(e) => {
                  const u = [...questions];
                  u[qi] = { ...u[qi], text: e.target.value };
                  setQuestions(u);
                }}
                placeholder="Question prompt..."
                className="flex-1 px-4 py-2.5 text-sm border border-[#D9CEDF] rounded-xl bg-white focus:outline-none focus:border-[#1E5BFF] focus:shadow-[0_0_0_3px_rgba(30,91,255,0.15)] font-sans"
              />
              {questions.length > 1 && (
                <button
                  onClick={() =>
                    setQuestions(questions.filter((_, i) => i !== qi))
                  }
                  className="text-[#6E6678] hover:text-[#EF4444] p-1.5 rounded-lg cursor-pointer"
                  title="Remove question"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-2 pl-4 sm:pl-8">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const u = [...questions];
                      u[qi] = { ...u[qi], correctOptionIndex: oi };
                      setQuestions(u);
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${q.correctOptionIndex === oi
                      ? "border-[#1E5BFF] bg-[#1E5BFF]"
                      : "border-[#D9CEDF] bg-white hover:border-[#1E5BFF]/50"
                      }`}
                    title="Mark as correct answer"
                  >
                    {q.correctOptionIndex === oi && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const u = [...questions];
                      u[qi] = {
                        ...u[qi],
                        options: u[qi].options.map((o, i) =>
                          i === oi ? e.target.value : o,
                        ),
                      };
                      setQuestions(u);
                    }}
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 px-3.5 py-2 text-xs border border-[#D9CEDF] rounded-xl bg-white focus:outline-none focus:border-[#1E5BFF] font-sans"
                  />
                  {q.options.length > 2 && (
                    <button
                      onClick={() => {
                        const u = [...questions];
                        const opts = u[qi].options.filter((_, i) => i !== oi);
                        u[qi] = {
                          ...u[qi],
                          options: opts,
                          correctOptionIndex: Math.min(
                            u[qi].correctOptionIndex,
                            opts.length - 1,
                          ),
                        };
                        setQuestions(u);
                      }}
                      className="text-[#6E6678] hover:text-[#EF4444] p-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {q.options.length < 6 && (
                <button
                  type="button"
                  onClick={() => {
                    const u = [...questions];
                    u[qi] = { ...u[qi], options: [...u[qi].options, ""] };
                    setQuestions(u);
                  }}
                  className="text-xs font-mono text-[#1E5BFF] hover:underline cursor-pointer pt-1 block"
                >
                  + Add option
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() =>
            setQuestions([
              ...questions,
              { text: "", options: ["", ""], correctOptionIndex: 0 },
            ])
          }
        >
          Add Question
        </Button>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Save className="h-3.5 w-3.5" />}
            isLoading={saving}
            onClick={save}
          >
            Save Quiz
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
