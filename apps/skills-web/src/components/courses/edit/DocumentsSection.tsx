import React, { useState, useRef } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { Button, Alert } from "@blih/ui";
import { uploadLessonDocument, deleteLessonDocument, fetchAdminCourse } from "@/lib/courses";
import type { Lesson, LessonDocument } from "@/types/course";
import { SectionCard } from "./SectionCard";

interface DocumentsSectionProps {
  courseId: string;
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
}

export function DocumentsSection({ courseId, lesson, onUpdate }: DocumentsSectionProps) {
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
