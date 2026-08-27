"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Plus, Pencil, Trash2, ChevronDown, Eye, EyeOff,
  Save, X, Upload, Check, ChevronRight, ArrowUp, ArrowDown,
  BookOpen, Video, FileText, HelpCircle, FileCheck, Sparkles,
  Layers, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import {
  Button, Badge, Alert, Spinner, Input, Textarea, ConfirmDialog,
  Card, CardHeader, CardTitle, CardContent, GlobalNavbar, Skeleton
} from "@/components/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchAdminCourse, updateCourse, publishCourse, unpublishCourse,
  createLesson, updateLesson, deleteLesson, reorderLessons,
  uploadLessonVideo, uploadLessonDocument, deleteLessonDocument,
  upsertQuiz, upsertAssignment
} from "@/lib/courses";
import type { Course, Lesson, QuizQuestion, LessonDocument } from "@/types/course";

// ─── Small shared section card wrapper ─────────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border border-[#D9CEDF] rounded-2xl overflow-hidden bg-white shadow-xs">
      <div className="px-5 py-3 bg-gradient-to-r from-[#EEF3FF] to-white border-b border-[#D9CEDF] flex items-center gap-2">
        {icon && <span className="text-[#1E5BFF]">{icon}</span>}
        <p className="text-xs font-mono font-bold text-[#17131F] uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection({ courseId, lesson, onUpdate }: { courseId: string; lesson: Lesson; onUpdate: (l: Lesson) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const updated = await uploadLessonVideo(courseId, lesson.id, file);
      onUpdate(updated);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <SectionCard title="Video Lesson" icon={<Video className="h-4 w-4" />}>
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {lesson.videoUrl ? (
        <div className="flex items-center justify-between gap-3 p-4 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E8F79]/10 text-[#2E8F79] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#17131F] font-display">Video Attached & Processed</p>
              <p className="text-xs font-mono text-[#6E6678]">Ready for learner streaming</p>
            </div>
          </div>
          <Button variant="outline" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
            Replace Video
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#D9CEDF] hover:border-[#1E5BFF]/50 bg-[#EEF3FF]/30 hover:bg-[#EEF3FF]/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
        >
          <Upload className="h-6 w-6 text-[#6E6678]" />
          <p className="text-sm font-bold text-[#17131F] font-display">Click to upload lecture video</p>
          <p className="text-xs font-mono text-[#6E6678]">MP4 format up to 500MB supported</p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </SectionCard>
  );
}

// ─── Documents Section ────────────────────────────────────────────────────────
function DocumentsSection({ courseId, lesson, onUpdate }: { courseId: string; lesson: Lesson; onUpdate: (l: Lesson) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      await uploadLessonDocument(courseId, lesson.id, file);
      const refreshed = await fetchAdminCourse(courseId);
      const updatedLesson = (refreshed?.lessons ?? []).find((l: any) => l.id === lesson.id);
      if (updatedLesson) onUpdate(updatedLesson as Lesson);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: LessonDocument) {
    setDeleting(doc.id);
    setError(null);
    try {
      await deleteLessonDocument(courseId, lesson.id, doc.id);
      onUpdate({ ...lesson, documents: lesson.documents.filter((d) => d.id !== doc.id) });
    } catch (e: any) {
      setError(e.message ?? "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <SectionCard title="Downloadable Resources & Documents" icon={<FileText className="h-4 w-4" />}>
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {lesson.documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between gap-3 p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="h-4 w-4 text-[#1E5BFF] shrink-0" />
            <span className="text-sm font-medium text-[#17131F] truncate">{doc.name}</span>
          </div>
          <button
            onClick={() => handleDelete(doc)}
            disabled={deleting === doc.id}
            className="text-[#6E6678] hover:text-[#EF4444] p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Delete document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Upload className="h-3.5 w-3.5" />}
          isLoading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          Attach PDF, DOCX or PPTX
        </Button>
        <span className="text-xs font-mono text-[#6E6678]">Max 50 MB per file</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx,.pptx"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </SectionCard>
  );
}

// ─── Quiz Section ─────────────────────────────────────────────────────────────
function QuizSection({ courseId, lesson, onUpdate }: { courseId: string; lesson: Lesson; onUpdate: (l: Lesson) => void }) {
  const existing = lesson.quiz;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    (existing?.questions as QuizQuestion[] | undefined) ?? [{ text: "", options: ["", ""], correctOptionIndex: 0 }]
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
      <SectionCard title="Assessment Quiz" icon={<HelpCircle className="h-4 w-4" />}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-[#6E6678]">No quiz configured for this lesson.</p>
          <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>
            Add Quiz
          </Button>
        </div>
      </SectionCard>
    );
  }

  if (!editing && existing) {
    return (
      <SectionCard title="Assessment Quiz" icon={<HelpCircle className="h-4 w-4" />}>
        <div className="flex items-center justify-between p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl">
          <div>
            <p className="text-sm font-bold text-[#17131F] font-display">{existing.title}</p>
            <p className="text-xs font-mono text-[#6E6678]">{(existing.questions as QuizQuestion[]).length} Questions configured</p>
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
    <SectionCard title="Assessment Quiz Builder" icon={<HelpCircle className="h-4 w-4" />}>
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      <Input
        label="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Chapter Knowledge Check"
      />
      <div className="space-y-4 pt-2">
        {questions.map((q, qi) => (
          <div key={qi} className="border border-[#D9CEDF] bg-[#EEF3FF]/20 rounded-2xl p-4 space-y-3">
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
                  onClick={() => setQuestions(questions.filter((_, i) => i !== qi))}
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
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      q.correctOptionIndex === oi
                        ? "border-[#1E5BFF] bg-[#1E5BFF]"
                        : "border-[#D9CEDF] bg-white hover:border-[#1E5BFF]/50"
                    }`}
                    title="Mark as correct answer"
                  >
                    {q.correctOptionIndex === oi && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const u = [...questions];
                      u[qi] = { ...u[qi], options: u[qi].options.map((o, i) => (i === oi ? e.target.value : o)) };
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
                          correctOptionIndex: Math.min(u[qi].correctOptionIndex, opts.length - 1),
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
          onClick={() => setQuestions([...questions, { text: "", options: ["", ""], correctOptionIndex: 0 }])}
        >
          Add Question
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
            Cancel
          </Button>
          <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={saving} onClick={save}>
            Save Quiz
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Assignment Section ───────────────────────────────────────────────────────
function AssignmentSection({ courseId, lesson, onUpdate }: { courseId: string; lesson: Lesson; onUpdate: (l: Lesson) => void }) {
  const existing = lesson.assignment;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [instructions, setInstructions] = useState(existing?.instructions ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const assignment = await upsertAssignment(courseId, lesson.id, { title, instructions });
      onUpdate({ ...lesson, assignment });
      setEditing(false);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && !existing) {
    return (
      <SectionCard title="Practical Assignment" icon={<FileCheck className="h-4 w-4" />}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-[#6E6678]">No practical assignment assigned.</p>
          <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>
            Add Assignment
          </Button>
        </div>
      </SectionCard>
    );
  }

  if (!editing && existing) {
    return (
      <SectionCard title="Practical Assignment" icon={<FileCheck className="h-4 w-4" />}>
        <div className="flex items-start justify-between gap-3 p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#17131F] font-display">{existing.title}</p>
            <p className="text-xs text-[#6E6678] font-sans line-clamp-2 mt-0.5">{existing.instructions}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => {
              setTitle(existing.title);
              setInstructions(existing.instructions);
              setEditing(true);
            }}
          >
            Edit
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Practical Assignment Brief" icon={<FileCheck className="h-4 w-4" />}>
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      <Input
        label="Assignment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Real-World Case Study"
      />
      <Textarea
        label="Instructions & Deliverables"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={4}
        placeholder="Specify instructions, rubric requirements, and submission links..."
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
          Cancel
        </Button>
        <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={saving} onClick={save}>
          Save Assignment
        </Button>
      </div>
    </SectionCard>
  );
}

// ─── Lesson Panel ─────────────────────────────────────────────────────────────
function LessonPanel({
  courseId,
  lesson,
  lessonIndex,
  totalLessons,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  courseId: string;
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  onUpdate: (l: Lesson) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
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
      const updated = await updateLesson(courseId, lesson.id, { title: titleVal.trim() });
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
      const updated = await updateLesson(courseId, lesson.id, { content: contentVal.trim() || null });
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
              <button onClick={saveTitle} disabled={saving} className="p-1 text-[#1E5BFF] cursor-pointer">
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
            {expanded ? <ChevronDown className="h-5 w-5 text-[#1E5BFF]" /> : <ChevronRight className="h-5 w-5" />}
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
          {saveError && <Alert variant="error" onClose={() => setSaveError(null)}>{saveError}</Alert>}

          {/* Written content */}
          <SectionCard title="Written Lesson Content" icon={<BookOpen className="h-4 w-4" />}>
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
                  <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={saving} onClick={saveContent}>
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
                  <p className="text-xs font-mono text-[#6E6678] italic">No written lecture content added yet.</p>
                )}
                <button
                  onClick={() => {
                    setContentVal(lesson.content ?? "");
                    setEditingContent(true);
                  }}
                  className="text-xs font-mono text-[#1E5BFF] hover:underline mt-2.5 cursor-pointer block font-semibold"
                >
                  {lesson.content ? "Edit lecture content" : "+ Add written lecture notes"}
                </button>
              </div>
            )}
          </SectionCard>

          <VideoSection courseId={courseId} lesson={lesson} onUpdate={onUpdate} />
          <DocumentsSection courseId={courseId} lesson={lesson} onUpdate={onUpdate} />
          <QuizSection courseId={courseId} lesson={lesson} onUpdate={onUpdate} />
          <AssignmentSection courseId={courseId} lesson={lesson} onUpdate={onUpdate} />
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

// ─── Main Course Edit Workspace ───────────────────────────────────────────────
function EditCourseContent({ courseId }: { courseId: string }) {
  const { user, logout } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLessonLoading, setAddingLessonLoading] = useState(false);
  const [addLessonError, setAddLessonError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchAdminCourse(courseId);
      if (!data) throw new Error("Course not found");
      setCourse(data);
      setMetaTitle(data.title);
      setMetaDesc(data.description);
      setLessons((data.lessons ?? []) as Lesson[]);
    } catch (e: any) {
      setLoadError(e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveMeta() {
    setMetaSaving(true);
    setMetaError(null);
    try {
      const updated = await updateCourse(courseId, { title: metaTitle.trim(), description: metaDesc.trim() });
      setCourse((c) => (c ? { ...c, title: updated.title, description: updated.description } : c));
      setEditingMeta(false);
    } catch (e: any) {
      setMetaError(e.message ?? "Failed to save");
    } finally {
      setMetaSaving(false);
    }
  }

  async function handlePublish() {
    if (!course) return;
    if (course.status === "PUBLISHED") {
      setConfirmUnpublish(true);
      return;
    }
    setPublishLoading(true);
    setPublishError(null);
    try {
      const updated = await publishCourse(courseId);
      setCourse((c) => (c ? { ...c, status: updated.status } : c));
    } catch (e: any) {
      setPublishError(e.message ?? "Failed to publish");
    } finally {
      setPublishLoading(false);
    }
  }

  async function doUnpublish() {
    setPublishLoading(true);
    setPublishError(null);
    setConfirmUnpublish(false);
    try {
      const updated = await unpublishCourse(courseId);
      setCourse((c) => (c ? { ...c, status: updated.status } : c));
    } catch (e: any) {
      setPublishError(e.message ?? "Failed to unpublish");
    } finally {
      setPublishLoading(false);
    }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim()) return;
    setAddingLessonLoading(true);
    setAddLessonError(null);
    try {
      const lesson = await createLesson(courseId, { title: newLessonTitle.trim() });
      setLessons((prev) => [...prev, lesson as Lesson]);
      setNewLessonTitle("");
      setAddingLesson(false);
    } catch (e: any) {
      setAddLessonError(e.message ?? "Failed to add lesson");
    } finally {
      setAddingLessonLoading(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    try {
      await deleteLesson(courseId, lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (e: any) {
      setLoadError(e.message ?? "Failed to delete lesson");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newLessons = [...lessons];
    const swap = direction === "up" ? index - 1 : index + 1;
    [newLessons[index], newLessons[swap]] = [newLessons[swap], newLessons[index]];
    const withOrder = newLessons.map((l, i) => ({ ...l, order: i }));
    setLessons(withOrder);
    try {
      await reorderLessons(courseId, withOrder.map((l) => ({ id: l.id, order: l.order })));
    } catch (e: any) {
      setLoadError(e.message ?? "Reorder failed");
      load();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative">
        <GlobalNavbar currentApp="courses" user={user} onSignOut={logout} />
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton variant="rectangular" className="h-6 w-32 rounded-lg" />
            <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
                <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
                <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
                <Skeleton variant="rectangular" className="h-32 w-full rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
                <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
                <div className="space-y-3">
                  <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
                  <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
                  <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalNavbar currentApp="courses" user={user} onSignOut={logout} />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4 flex-1">
          <Link href="/admin/courses">
            <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">
              Back to Courses
            </Button>
          </Link>
          <Alert variant="error">{loadError ?? "Course not found"}</Alert>
        </div>
      </div>
    );
  }

  const isPublished = course.status === "PUBLISHED";

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col font-sans antialiased relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="courses" user={user} onSignOut={logout} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
          <div className="space-y-1.5">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Course Management
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                {course.title}
              </h1>
              <Badge variant={isPublished ? "verified" : "secondary"}>
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </Badge>
            </div>
            <p className="text-sm text-[#6E6678]">
              Manage curriculum structure, video lectures, assessments, and learning resources.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto self-start lg:self-center">
            <Button
              variant={isPublished ? "outline" : "primary"}
              className="w-full sm:w-auto"
              leftIcon={isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              isLoading={publishLoading}
              onClick={handlePublish}
            >
              {isPublished ? "Unpublish Catalog" : "Publish Course"}
            </Button>
          </div>
        </div>

        {publishError && <Alert variant="error" onClose={() => setPublishError(null)}>{publishError}</Alert>}
        {loadError && <Alert variant="error" onClose={() => setLoadError(null)}>{loadError}</Alert>}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Lessons Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#17131F]">
                    Course Curriculum
                  </h2>
                  <p className="text-xs font-mono text-[#6E6678]">{lessons.length} Modules in sequence</p>
                </div>
              </div>
              {!addingLesson && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setAddingLesson(true)}
                >
                  Add Lesson
                </Button>
              )}
            </div>

            {addingLesson && (
              <div className="border-2 border-[#1E5BFF] bg-[#EEF3FF]/40 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-lg text-[#17131F]">New Lesson Module</h4>
                  <Badge variant="primary" size="sm">STEP {lessons.length + 1}</Badge>
                </div>
                {addLessonError && <Alert variant="error" onClose={() => setAddLessonError(null)}>{addLessonError}</Alert>}
                <Input
                  label="Module Title"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLesson();
                    if (e.key === "Escape") {
                      setAddingLesson(false);
                      setNewLessonTitle("");
                    }
                  }}
                  placeholder="e.g. Chapter 1: Core Architecture & Setup"
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingLesson(false);
                      setNewLessonTitle("");
                    }}
                    disabled={addingLessonLoading}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" variant="primary" isLoading={addingLessonLoading} onClick={handleAddLesson}>
                    Create Lesson
                  </Button>
                </div>
              </div>
            )}

            {lessons.length === 0 && !addingLesson && (
              <div className="border-2 border-dashed border-[#D9CEDF] rounded-3xl p-12 text-center bg-white space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto shadow-xs">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#17131F]">No curriculum modules yet</h3>
                <p className="text-sm text-[#6E6678] font-sans max-w-sm mx-auto">
                  Click &quot;Add Lesson&quot; to begin building chapters, video lectures, and quizzes for this course.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setAddingLesson(true)}
                >
                  Add First Lesson
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <LessonPanel
                  key={lesson.id}
                  courseId={courseId}
                  lesson={lesson}
                  lessonIndex={index}
                  totalLessons={lessons.length}
                  onUpdate={(updated) =>
                    setLessons((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
                  }
                  onDelete={() => handleDeleteLesson(lesson.id)}
                  onMoveUp={() => handleMove(index, "up")}
                  onMoveDown={() => handleMove(index, "down")}
                />
              ))}
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Course Metadata Card */}
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold font-display text-[#17131F]">Course Overview</CardTitle>
                  {!editingMeta && (
                    <button
                      onClick={() => {
                        setMetaTitle(course.title);
                        setMetaDesc(course.description);
                        setEditingMeta(true);
                      }}
                      className="p-2 text-[#6E6678] hover:text-[#1E5BFF] hover:bg-[#EEF3FF] rounded-xl transition-colors cursor-pointer"
                      title="Edit Course Details"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4 bg-white">
                {editingMeta ? (
                  <div className="space-y-4">
                    {metaError && <Alert variant="error" onClose={() => setMetaError(null)}>{metaError}</Alert>}
                    <Input
                      label="Title"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      maxLength={200}
                    />
                    <Textarea
                      label="Description"
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="Course description..."
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditingMeta(false)} disabled={metaSaving}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={metaSaving} onClick={saveMeta}>
                        Save Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans">
                    <div>
                      <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">Title</p>
                      <p className="text-base font-bold text-[#17131F] font-display mt-0.5">{course.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">Description</p>
                      <p className="text-sm text-[#6E6678] mt-0.5 leading-relaxed">{course.description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Panel */}
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-[#17131F]">Curriculum Metrics</h3>
              <div className="grid grid-cols-2 gap-3 font-sans">
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Lessons</p>
                  <p className="text-2xl font-bold font-display text-[#1E5BFF] mt-1">{lessons.length}</p>
                </div>
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Videos</p>
                  <p className="text-2xl font-bold font-display text-[#2E8F79] mt-1">
                    {lessons.filter((l) => l.videoUrl).length}
                  </p>
                </div>
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Quizzes</p>
                  <p className="text-2xl font-bold font-display text-[#FF8A5B] mt-1">
                    {lessons.filter((l) => l.quiz).length}
                  </p>
                </div>
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Assignments</p>
                  <p className="text-2xl font-bold font-display text-[#17131F] mt-1">
                    {lessons.filter((l) => l.assignment).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={confirmUnpublish}
        onClose={() => setConfirmUnpublish(false)}
        onConfirm={doUnpublish}
        title="Unpublish Course"
        message="This course will be removed from the public catalog. Learner data is preserved. Continue?"
        confirmText="Unpublish Course"
        variant="destructive"
      />
    </div>
  );
}

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <EditCourseContent courseId={courseId} />
    </AuthGuard>
  );
}
