"use client";

import React, { useState, useRef } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { Button, Alert, ConfirmDialog } from "@blih/ui";
import {
  uploadLessonDocument,
  deleteLessonDocument,
  fetchAdminCourse,
} from "@/lib/courses";
import type { Lesson, LessonDocument } from "@/types/course";
import { SectionCard } from "./SectionCard";
import { UploadProgressCard } from "./UploadProgressCard";

interface DocumentsSectionProps {
  courseId: string;
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function DocumentsSection({
  courseId,
  lesson,
  onUpdate,
}: DocumentsSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [docToDelete, setDocToDelete] = useState<LessonDocument | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadFile(file);
    setUploadProgress(15);
    setError(null);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.floor(Math.random() * 15) + 8;
      });
    }, 250);

    try {
      await uploadLessonDocument(courseId, lesson.id, file);
      const refreshed = await fetchAdminCourse(courseId);
      clearInterval(timer);
      setUploadProgress(100);

      setTimeout(() => {
        const updatedLesson = (refreshed?.lessons ?? []).find(
          (l: any) => l.id === lesson.id,
        );
        if (updatedLesson) onUpdate(updatedLesson as Lesson);
        setUploading(false);
        setUploadFile(null);
        setUploadProgress(0);
      }, 350);
    } catch (e: any) {
      clearInterval(timer);
      setError(e.message ?? "Document upload failed");
      setUploading(false);
      setUploadFile(null);
      setUploadProgress(0);
    }
  }

  async function handleDelete(doc: LessonDocument) {
    setDocToDelete(null);
    setDeleting(doc.id);
    setError(null);
    try {
      await deleteLessonDocument(courseId, lesson.id, doc.id);
      onUpdate({
        ...lesson,
        documents: lesson.documents.filter((d) => d.id !== doc.id),
      });
    } catch (e: any) {
      setError(e.message ?? "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <SectionCard
      title="Downloadable Resources & Documents"
      icon={<FileText className="h-4 w-4" />}
    >
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Upload Progress Active State */}
      {uploading && uploadFile && (
        <UploadProgressCard
          fileName={uploadFile.name}
          fileSize={formatBytes(uploadFile.size)}
          progress={uploadProgress}
          type="document"
          statusText="Uploading document & attaching to lesson..."
        />
      )}

      {lesson.documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between gap-3 p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="h-4 w-4 text-[#1E5BFF] shrink-0" />
            <span className="text-sm font-medium text-[#17131F] truncate">
              {doc.name}
            </span>
          </div>
          <button
            onClick={() => setDocToDelete(doc)}
            disabled={deleting === doc.id}
            className="text-[#6E6678] hover:text-[#EF4444] p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Delete document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {!uploading && (
        <div className="flex items-center gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Upload className="h-3.5 w-3.5" />}
            isLoading={uploading}
            onClick={() => fileRef.current?.click()}
          >
            Attach PDF, DOCX or PPTX
          </Button>
          <span className="text-xs font-mono text-[#6E6678]">
            Max 50 MB per file
          </span>
        </div>
      )}

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

      {/* Custom Blih UI Confirm Modal */}
      <ConfirmDialog
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={() => docToDelete && handleDelete(docToDelete)}
        title="Delete Document"
        message={`Are you sure you want to delete "${docToDelete?.name}"? Students will no longer be able to download this resource.`}
        confirmText="Delete Document"
        variant="destructive"
      />
    </SectionCard>
  );
}
