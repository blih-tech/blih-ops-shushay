"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Pencil,
  Check,
  X,
  BookOpen,
  Save,
} from "lucide-react";
import { Button, Alert, ConfirmDialog, Textarea } from "@blih/ui";
import { updateLesson } from "@/lib/courses";
import type { Lesson } from "@/types/course";
import { SectionCard } from "./SectionCard";
import { VideoSection } from "./VideoSection";
import { DocumentsSection } from "./DocumentsSection";
import { QuizSection } from "./QuizSection";
import { AssignmentSection } from "./AssignmentSection";

interface LessonPanelProps {
  courseId: string;
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  onUpdate: (l: Lesson) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function LessonPanel({
  courseId,
  lesson,
  lessonIndex,
  totalLessons,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: LessonPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [titleVal, setTitleVal] = useState(lesson.title);
  const [contentVal, setContentVal] = useState(lesson.content ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function saveTitle() {
    if (!titleVal.trim() || titleVal.trim() === lesson.title) {
      setEditingTitle(false);
      setTitleVal(lesson.title);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateLesson(courseId, lesson.id, {
        title: titleVal.trim(),
      });
      onUpdate(updated);
      setEditingTitle(false);
    } catch (e: any) {
      setSaveError(e.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveContent() {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateLesson(courseId, lesson.id, {
        content: contentVal.trim() || null,
      });
      onUpdate(updated);
      setEditingContent(false);
    } catch (e: any) {
      setSaveError(e.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-[#D9CEDF] rounded-3xl overflow-hidden bg-white shadow-xs transition-all">
      {/* Header row */}
      <div className="flex items-center gap-3.5 px-6 py-4.5 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white hover:bg-[#EEF3FF]/40 transition-colors">
        <span className="w-8 h-8 rounded-xl bg-[#1E5BFF] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
          {lessonIndex + 1}
        </span>
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setEditingTitle(false);
                    setTitleVal(lesson.title);
                  }
                }}
                autoFocus
                className="flex-1 text-base font-bold bg-white border border-[#1E5BFF] rounded-xl px-3 py-1.5 focus:outline-none font-display text-[#17131F]"
              />
              <button
                onClick={saveTitle}
                disabled={saving}
                className="p-1 text-[#1E5BFF] cursor-pointer"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setEditingTitle(false);
                  setTitleVal(lesson.title);
                }}
                className="p-1 text-[#6E6678] hover:text-[#17131F] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="text-base font-bold text-[#17131F] font-display hover:text-[#1E5BFF] cursor-pointer text-left group flex items-center gap-2"
            >
              <span>{lesson.title}</span>
              <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={lessonIndex === 0 || saving}
            className="p-2 text-[#6E6678] hover:text-[#17131F] hover:bg-white rounded-xl cursor-pointer disabled:opacity-30 transition-colors"
            title="Move Up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={lessonIndex === totalLessons - 1 || saving}
            className="p-2 text-[#6E6678] hover:text-[#17131F] hover:bg-white rounded-xl cursor-pointer disabled:opacity-30 transition-colors"
            title="Move Down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-[#17131F] hover:bg-white rounded-xl cursor-pointer transition-colors"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-[#1E5BFF]" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 text-[#6E6678] hover:text-[#EF4444] hover:bg-[#FFF0F0] rounded-xl cursor-pointer transition-colors"
            title="Delete Lesson"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lesson body */}
      {expanded && (
        <div className="p-6 sm:p-8 border-t border-[#D9CEDF] space-y-6 bg-white">
          {saveError && (
            <Alert variant="error" onClose={() => setSaveError(null)}>
              {saveError}
            </Alert>
          )}

          {/* Written content */}
          <SectionCard
            title="Written Lesson Content"
            icon={<BookOpen className="h-4 w-4" />}
          >
            {editingContent ? (
              <div className="space-y-3">
                <Textarea
                  value={contentVal}
                  onChange={(e) => setContentVal(e.target.value)}
                  rows={6}
                  showCharCount
                  placeholder="Write in-depth lesson lecture notes, markdown explanations, formulas, or code snippets..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingContent(false);
                      setContentVal(lesson.content ?? "");
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Save className="h-3.5 w-3.5" />}
                    isLoading={saving}
                    onClick={saveContent}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {lesson.content ? (
                  <pre className="text-xs text-[#17131F] font-sans whitespace-pre-wrap bg-[#EEF3FF]/40 border border-[#D9CEDF] p-4 rounded-xl max-h-40 overflow-y-auto leading-relaxed">
                    {lesson.content}
                  </pre>
                ) : (
                  <p className="text-xs font-mono text-[#6E6678] italic">
                    No written lecture content added yet.
                  </p>
                )}
                <button
                  onClick={() => {
                    setContentVal(lesson.content ?? "");
                    setEditingContent(true);
                  }}
                  className="text-xs font-mono text-[#1E5BFF] hover:underline mt-2.5 cursor-pointer block font-semibold"
                >
                  {lesson.content
                    ? "Edit lecture content"
                    : "+ Add written lecture notes"}
                </button>
              </div>
            )}
          </SectionCard>

          <VideoSection
            courseId={courseId}
            lesson={lesson}
            onUpdate={onUpdate}
          />
          <DocumentsSection
            courseId={courseId}
            lesson={lesson}
            onUpdate={onUpdate}
          />
          <QuizSection
            courseId={courseId}
            lesson={lesson}
            onUpdate={onUpdate}
          />
          <AssignmentSection
            courseId={courseId}
            lesson={lesson}
            onUpdate={onUpdate}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={onDelete}
        title="Delete Lesson"
        message={`Delete "${lesson.title}"? All content, video, documents, quiz, and assignment will be permanently removed.`}
        confirmText="Delete Lesson"
        variant="destructive"
      />
    </div>
  );
}
