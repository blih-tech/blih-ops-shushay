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
import { getErrorMessage } from "@/lib/errorUtils";

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
    } catch (e: unknown) {
      setSaveError(getErrorMessage(e) ?? "Failed");
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
    } catch (e: unknown) {
      setSaveError(getErrorMessage(e) ?? "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-[#D9CEDF] rounded-2xl overflow-hidden bg-white shadow-xs transition-all">
      {/* Header row — click anywhere to expand/collapse */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !editingTitle && setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (!editingTitle && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        className={`flex items-center gap-3.5 px-5 py-4 transition-colors select-none ${
          editingTitle
            ? "bg-white"
            : "cursor-pointer hover:bg-[#F4F1F8] active:bg-[#EBE5F0]"
        } ${expanded ? "bg-[#F9F8FC]" : "bg-white"}`}
      >
        {/* Expand indicator */}
        <span className="shrink-0 text-[#9B8FA8] transition-transform duration-200">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[#1E5BFF]" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>

        {/* Lesson index badge */}
        <span className="w-7 h-7 rounded-lg bg-[#EEF3FF] text-[#1E5BFF] text-xs font-mono font-bold flex items-center justify-center shrink-0">
          {lessonIndex + 1}
        </span>

        {/* Title / inline edit */}
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
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
                className="flex-1 text-sm font-semibold bg-white border border-[#1E5BFF] rounded-lg px-3 py-1.5 focus:outline-none font-display text-[#17131F]"
              />
              <button
                onClick={saveTitle}
                disabled={saving}
                className="p-1.5 text-[#1E5BFF] hover:bg-[#EEF3FF] rounded-lg cursor-pointer transition-colors"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setEditingTitle(false);
                  setTitleVal(lesson.title);
                }}
                className="p-1.5 text-[#6E6678] hover:bg-[#F4F1F8] rounded-lg cursor-pointer transition-colors"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-[#17131F] font-display truncate">
              {lesson.title}
            </p>
          )}
        </div>

        {/* Action buttons — stop propagation so they don't toggle expand */}
        {!editingTitle && (
          <div
            className="flex items-center gap-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingTitle(true)}
              className="p-2 text-[#9B8FA8] hover:text-[#1E5BFF] hover:bg-[#EEF3FF] rounded-lg cursor-pointer transition-colors"
              title="Rename lesson"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onMoveUp}
              disabled={lessonIndex === 0 || saving}
              className="p-2 text-[#9B8FA8] hover:text-[#17131F] hover:bg-[#F4F1F8] rounded-lg cursor-pointer disabled:opacity-30 transition-colors"
              title="Move Up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={lessonIndex === totalLessons - 1 || saving}
              className="p-2 text-[#9B8FA8] hover:text-[#17131F] hover:bg-[#F4F1F8] rounded-lg cursor-pointer disabled:opacity-30 transition-colors"
              title="Move Down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 text-[#9B8FA8] hover:text-[#EF4444] hover:bg-[#FFF0F0] rounded-lg cursor-pointer transition-colors"
              title="Delete Lesson"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
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
