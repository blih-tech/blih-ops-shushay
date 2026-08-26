"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Plus, Pencil, Trash2, ChevronDown, Eye, EyeOff,
  Save, X, Upload, Check, ChevronRight, ArrowUp, ArrowDown
} from "lucide-react";
import {
  Button, Badge, Alert, Spinner, Input, ConfirmDialog,
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  fetchAdminCourse, updateCourse, publishCourse, unpublishCourse,
  createLesson, updateLesson, deleteLesson, reorderLessons,
  uploadLessonVideo, uploadLessonDocument, deleteLessonDocument,
  upsertQuiz, upsertAssignment
} from "@/lib/courses";
import type { Course, Lesson, QuizQuestion, LessonDocument } from "@/types/course";

// ─── Small shared section wrapper ─────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">{title}</p>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection({ courseId, lesson, onUpdate }: { courseId: string; lesson: Lesson; onUpdate: (l: Lesson) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true); setError(null);
    try {
      const updated = await uploadLessonVideo(courseId, lesson.id, file);
      onUpdate(updated);
    } catch (e: any) { setError(e.message ?? "Upload failed"); }
    finally { setUploading(false); }
  }

  return (
    <SectionCard title="Video">
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {lesson.videoUrl ? (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
          <span className="text-xs text-foreground font-sans flex-1 truncate">Video uploaded ✓</span>
          <Button variant="outline" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>Replace</Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />} isLoading={uploading} onClick={() => fileRef.current?.click()}>
          Upload Video
        </Button>
      )}
      <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <p className="text-xs text-muted-foreground font-sans">MP4, WebM, MOV — max 500 MB</p>
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
    setUploading(true); setError(null);
    try {
      await uploadLessonDocument(courseId, lesson.id, file);
      const refreshed = await fetchAdminCourse(courseId);
      const updatedLesson = (refreshed?.lessons ?? []).find((l: any) => l.id === lesson.id);
      if (updatedLesson) onUpdate(updatedLesson as Lesson);
    } catch (e: any) { setError(e.message ?? "Upload failed"); }
    finally { setUploading(false); }
  }

  async function handleDelete(doc: LessonDocument) {
    setDeleting(doc.id); setError(null);
    try {
      await deleteLessonDocument(courseId, lesson.id, doc.id);
      onUpdate({ ...lesson, documents: lesson.documents.filter((d) => d.id !== doc.id) });
    } catch (e: any) { setError(e.message ?? "Delete failed"); }
    finally { setDeleting(null); }
  }

  return (
    <SectionCard title="Documents">
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {lesson.documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <span className="text-xs text-foreground font-sans truncate flex-1">{doc.name}</span>
          <button onClick={() => handleDelete(doc)} disabled={deleting === doc.id}
            className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded cursor-pointer disabled:opacity-50">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button variant="secondary" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />} isLoading={uploading} onClick={() => fileRef.current?.click()}>
        Upload Document
      </Button>
      <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <p className="text-xs text-muted-foreground font-sans">PDF, DOCX, PPTX — max 50 MB</p>
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
    setSaving(true); setError(null);
    try {
      const quiz = await upsertQuiz(courseId, lesson.id, { title, questions });
      onUpdate({ ...lesson, quiz });
      setEditing(false);
    } catch (e: any) { setError(e.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  if (!editing && !existing) {
    return (
      <SectionCard title="Quiz">
        <Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>Add Quiz</Button>
      </SectionCard>
    );
  }

  if (!editing && existing) {
    return (
      <SectionCard title="Quiz">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground font-sans">{existing.title}</p>
            <p className="text-xs text-muted-foreground">{(existing.questions as QuizQuestion[]).length} questions</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => { setTitle(existing.title); setQuestions(existing.questions as QuizQuestion[]); setEditing(true); }}>
            Edit
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Quiz">
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      <Input label="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 1 Quiz" />
      <div className="space-y-3">
        {questions.map((q, qi) => (
          <div key={qi} className="border border-border rounded-md p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">Q{qi + 1}</span>
              <input value={q.text} onChange={(e) => { const u = [...questions]; u[qi] = { ...u[qi], text: e.target.value }; setQuestions(u); }}
                placeholder="Question text..."
                className="flex-1 px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans" />
              {questions.length > 1 && (
                <button onClick={() => setQuestions(questions.filter((_, i) => i !== qi))} className="text-muted-foreground hover:text-destructive cursor-pointer"><X className="h-3.5 w-3.5" /></button>
              )}
            </div>
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2 pl-5">
                <button onClick={() => { const u = [...questions]; u[qi] = { ...u[qi], correctOptionIndex: oi }; setQuestions(u); }}
                  className={"w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors " + (q.correctOptionIndex === oi ? "border-primary bg-primary" : "border-border hover:border-primary/50")}>
                  {q.correctOptionIndex === oi && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
                <input value={opt} onChange={(e) => { const u = [...questions]; u[qi] = { ...u[qi], options: u[qi].options.map((o, i) => i === oi ? e.target.value : o) }; setQuestions(u); }}
                  placeholder={`Option ${oi + 1}`}
                  className="flex-1 px-3 py-1 text-xs border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20 font-sans" />
                {q.options.length > 2 && (
                  <button onClick={() => { const u = [...questions]; const opts = u[qi].options.filter((_, i) => i !== oi); u[qi] = { ...u[qi], options: opts, correctOptionIndex: Math.min(u[qi].correctOptionIndex, opts.length - 1) }; setQuestions(u); }} className="text-muted-foreground hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                )}
              </div>
            ))}
            {q.options.length < 6 && (
              <button onClick={() => { const u = [...questions]; u[qi] = { ...u[qi], options: [...u[qi].options, ""] }; setQuestions(u); }} className="ml-11 text-xs text-primary hover:underline cursor-pointer font-sans">+ Add option</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => setQuestions([...questions, { text: "", options: ["", ""], correctOptionIndex: 0 }])} className="text-xs text-primary hover:underline cursor-pointer font-sans">+ Add question</button>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={saving} onClick={save}>Save Quiz</Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
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
    setSaving(true); setError(null);
    try {
      const assignment = await upsertAssignment(courseId, lesson.id, { title, instructions });
      onUpdate({ ...lesson, assignment });
      setEditing(false);
    } catch (e: any) { setError(e.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  if (!editing && !existing) {
    return <SectionCard title="Assignment"><Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>Add Assignment</Button></SectionCard>;
  }

  if (!editing && existing) {
    return (
      <SectionCard title="Assignment">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground font-sans">{existing.title}</p>
            <p className="text-xs text-muted-foreground font-sans line-clamp-2 mt-0.5">{existing.instructions}</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} className="shrink-0"
            onClick={() => { setTitle(existing.title); setInstructions(existing.instructions); setEditing(true); }}>
            Edit
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Assignment">
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      <Input label="Assignment Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Practice Exercise" />
      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5">Instructions</label>
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4}
          className="appearance-none block w-full px-4 py-3 bg-background text-foreground border border-border rounded-md text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={saving} onClick={save}>Save Assignment</Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
      </div>
    </SectionCard>
  );
}

// ─── Lesson Panel ─────────────────────────────────────────────────────────────
function LessonPanel({ courseId, lesson, lessonIndex, totalLessons, onUpdate, onDelete, onMoveUp, onMoveDown }: {
  courseId: string; lesson: Lesson; lessonIndex: number; totalLessons: number;
  onUpdate: (l: Lesson) => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void;
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
    if (!titleVal.trim() || titleVal.trim() === lesson.title) { setEditingTitle(false); setTitleVal(lesson.title); return; }
    setSaving(true); setSaveError(null);
    try { const updated = await updateLesson(courseId, lesson.id, { title: titleVal.trim() }); onUpdate(updated); setEditingTitle(false); }
    catch (e: any) { setSaveError(e.message ?? "Failed"); }
    finally { setSaving(false); }
  }

  async function saveContent() {
    setSaving(true); setSaveError(null);
    try { const updated = await updateLesson(courseId, lesson.id, { content: contentVal.trim() || null }); onUpdate(updated); setEditingContent(false); }
    catch (e: any) { setSaveError(e.message ?? "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/20 transition-colors">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold flex items-center justify-center shrink-0">{lessonIndex + 1}</span>
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input value={titleVal} onChange={(e) => setTitleVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditingTitle(false); setTitleVal(lesson.title); } }}
                autoFocus className="flex-1 text-sm font-medium bg-background border border-primary rounded-md px-2 py-1 focus:outline-none font-sans" />
              <button onClick={saveTitle} disabled={saving} className="text-primary cursor-pointer disabled:opacity-50"><Check className="h-4 w-4" /></button>
              <button onClick={() => { setEditingTitle(false); setTitleVal(lesson.title); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <button onClick={() => setEditingTitle(true)} className="text-sm font-medium text-foreground font-sans hover:text-primary cursor-pointer text-left group flex items-center gap-1.5">
              {lesson.title}
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onMoveUp} disabled={lessonIndex === 0 || saving} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer disabled:opacity-30" title="Move Up"><ArrowUp className="h-3.5 w-3.5" /></button>
          <button onClick={onMoveDown} disabled={lessonIndex === totalLessons - 1 || saving} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer disabled:opacity-30" title="Move Down"><ArrowDown className="h-3.5 w-3.5" /></button>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer" title={expanded ? "Collapse" : "Expand"}>
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => setConfirmDelete(true)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded cursor-pointer" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* Lesson body */}
      {expanded && (
        <div className="p-4 border-t border-border space-y-4 bg-muted/5">
          {saveError && <Alert variant="error" onClose={() => setSaveError(null)}>{saveError}</Alert>}

          {/* Written content */}
          <SectionCard title="Written Content">
            {editingContent ? (
              <>
                <textarea value={contentVal} onChange={(e) => setContentVal(e.target.value)} rows={6} placeholder="Write lesson content (plain text or Markdown)..."
                  className="appearance-none block w-full px-4 py-3 bg-background text-foreground border border-border rounded-md text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={saving} onClick={saveContent}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditingContent(false); setContentVal(lesson.content ?? ""); }} disabled={saving}>Cancel</Button>
                </div>
              </>
            ) : (
              <div>
                {lesson.content ? (
                  <pre className="text-xs text-foreground font-sans whitespace-pre-wrap bg-muted/40 p-3 rounded-md max-h-32 overflow-y-auto">{lesson.content}</pre>
                ) : (
                  <p className="text-xs text-muted-foreground italic font-sans">No written content yet.</p>
                )}
                <button onClick={() => { setContentVal(lesson.content ?? ""); setEditingContent(true); }} className="text-xs text-primary hover:underline mt-2 cursor-pointer font-sans">
                  {lesson.content ? "Edit content" : "Add written content"}
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
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function EditCourseContent({ courseId }: { courseId: string }) {
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
    setLoading(true); setLoadError(null);
    try {
      const data = await fetchAdminCourse(courseId);
      if (!data) throw new Error("Course not found");
      setCourse(data); setMetaTitle(data.title); setMetaDesc(data.description);
      setLessons((data.lessons ?? []) as Lesson[]);
    } catch (e: any) { setLoadError(e.message ?? "Failed to load"); }
    finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  async function saveMeta() {
    setMetaSaving(true); setMetaError(null);
    try {
      const updated = await updateCourse(courseId, { title: metaTitle.trim(), description: metaDesc.trim() });
      setCourse((c) => c ? { ...c, title: updated.title, description: updated.description } : c);
      setEditingMeta(false);
    } catch (e: any) { setMetaError(e.message ?? "Failed to save"); }
    finally { setMetaSaving(false); }
  }

  async function handlePublish() {
    if (!course) return;
    if (course.status === "PUBLISHED") { setConfirmUnpublish(true); return; }
    setPublishLoading(true); setPublishError(null);
    try { const updated = await publishCourse(courseId); setCourse((c) => c ? { ...c, status: updated.status } : c); }
    catch (e: any) { setPublishError(e.message ?? "Failed to publish"); }
    finally { setPublishLoading(false); }
  }

  async function doUnpublish() {
    setPublishLoading(true); setPublishError(null); setConfirmUnpublish(false);
    try { const updated = await unpublishCourse(courseId); setCourse((c) => c ? { ...c, status: updated.status } : c); }
    catch (e: any) { setPublishError(e.message ?? "Failed to unpublish"); }
    finally { setPublishLoading(false); }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim()) return;
    setAddingLessonLoading(true); setAddLessonError(null);
    try {
      const lesson = await createLesson(courseId, { title: newLessonTitle.trim() });
      setLessons((prev) => [...prev, lesson as Lesson]);
      setNewLessonTitle(""); setAddingLesson(false);
    } catch (e: any) { setAddLessonError(e.message ?? "Failed to add lesson"); }
    finally { setAddingLessonLoading(false); }
  }

  async function handleDeleteLesson(lessonId: string) {
    try { await deleteLesson(courseId, lessonId); setLessons((prev) => prev.filter((l) => l.id !== lessonId)); }
    catch (e: any) { setLoadError(e.message ?? "Failed to delete lesson"); }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newLessons = [...lessons];
    const swap = direction === "up" ? index - 1 : index + 1;
    [newLessons[index], newLessons[swap]] = [newLessons[swap], newLessons[index]];
    const withOrder = newLessons.map((l, i) => ({ ...l, order: i }));
    setLessons(withOrder);
    try { await reorderLessons(courseId, withOrder.map((l) => ({ id: l.id, order: l.order }))); }
    catch (e: any) { setLoadError(e.message ?? "Reorder failed"); load(); }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center"><Spinner size="lg" color="primary" /></div>;

  if (loadError || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Link href="/admin/courses"><Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">Back</Button></Link>
        <Alert variant="error">{loadError ?? "Course not found"}</Alert>
      </div>
    );
  }

  const isPublished = course.status === "PUBLISHED";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses"><Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button></Link>
          <Badge variant={isPublished ? "success" : "default"}>{isPublished ? "Published" : "Draft"}</Badge>
        </div>
        <Button
          variant={isPublished ? "outline" : "primary"}
          leftIcon={isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          isLoading={publishLoading}
          onClick={handlePublish}
        >
          {isPublished ? "Unpublish" : "Publish Course"}
        </Button>
      </div>

      {publishError && <Alert variant="error" onClose={() => setPublishError(null)}>{publishError}</Alert>}
      {loadError && <Alert variant="error" onClose={() => setLoadError(null)}>{loadError}</Alert>}

      {/* Course metadata card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl leading-snug">{course.title}</CardTitle>
            {!editingMeta && (
              <button onClick={() => { setMetaTitle(course.title); setMetaDesc(course.description); setEditingMeta(true); }}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer shrink-0">
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
          {!editingMeta && <p className="text-sm text-muted-foreground font-sans leading-relaxed">{course.description}</p>}
        </CardHeader>
        {editingMeta && (
          <CardContent>
            {metaError && <Alert variant="error" onClose={() => setMetaError(null)} className="mb-4">{metaError}</Alert>}
            <div className="space-y-4">
              <Input label="Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={200} />
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={4} maxLength={2000}
                  className="appearance-none block w-full px-4 py-3 bg-background text-foreground border border-border rounded-md text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                <p className="text-xs text-muted-foreground font-mono mt-1 text-right">{metaDesc.length} / 2000</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={metaSaving} onClick={saveMeta}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingMeta(false)} disabled={metaSaving}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lessons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Lessons <span className="text-base font-normal text-muted-foreground">({lessons.length})</span>
          </h2>
          {!addingLesson && (
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddingLesson(true)}>Add Lesson</Button>
          )}
        </div>

        {addingLesson && (
          <div className="border border-primary/30 bg-accent/10 rounded-lg p-4 space-y-3">
            {addLessonError && <Alert variant="error" onClose={() => setAddLessonError(null)}>{addLessonError}</Alert>}
            <Input label="Lesson Title" value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddLesson(); if (e.key === "Escape") { setAddingLesson(false); setNewLessonTitle(""); } }}
              placeholder="e.g. Introduction" autoFocus />
            <div className="flex gap-2">
              <Button size="sm" variant="primary" isLoading={addingLessonLoading} onClick={handleAddLesson}>Add Lesson</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAddingLesson(false); setNewLessonTitle(""); }} disabled={addingLessonLoading}>Cancel</Button>
            </div>
          </div>
        )}

        {lessons.length === 0 && !addingLesson && (
          <div className="border border-dashed border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground font-sans">No lessons yet. Add your first lesson.</p>
          </div>
        )}

        {lessons.map((lesson, index) => (
          <LessonPanel
            key={lesson.id}
            courseId={courseId}
            lesson={lesson}
            lessonIndex={index}
            totalLessons={lessons.length}
            onUpdate={(updated) => setLessons((prev) => prev.map((l) => l.id === updated.id ? updated : l))}
            onDelete={() => handleDeleteLesson(lesson.id)}
            onMoveUp={() => handleMove(index, "up")}
            onMoveDown={() => handleMove(index, "down")}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmUnpublish}
        onClose={() => setConfirmUnpublish(false)}
        onConfirm={doUnpublish}
        title="Unpublish Course"
        message="This course will be removed from the public catalog. Learner data is preserved. Continue?"
        confirmText="Unpublish"
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
