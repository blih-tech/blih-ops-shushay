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
import { getErrorMessage } from "@/lib/errorUtils";

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
    } catch (e: unknown) {
      clearInterval(timer);
      setError(getErrorMessage(e) ?? "Document upload failed");
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
    } catch (e: unknown) {
      setError(getErrorMessage(e) ?? "Delete failed");
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

      {lesson.documents.map((doc) => {
        const url = (doc as any).url || "";
        const extMatch = (doc.name || url).match(/\.([a-z0-9]+)$/i);
        const ext = extMatch ? extMatch[1].toUpperCase() : "FILE";

        return (
          <div
            key={doc.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF] flex items-center justify-center shrink-0 border border-[#1E5BFF]/20">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#17131F] truncate max-w-[220px] sm:max-w-xs font-display" title={doc.name}>
                    {doc.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#D9CEDF] text-[#475569] font-bold">
                    {ext}
                  </span>
                </div>
                {url && (
                  <p className="text-[11px] font-mono text-[#6E6678] truncate max-w-[260px] sm:max-w-xs">
                    Attached resource
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E5BFF] bg-white border border-[#D9CEDF] hover:border-[#1E5BFF] hover:bg-[#EEF3FF] px-2.5 py-1.5 rounded-lg transition-all"
                  title="Open or download file"
                >
                  View File
                </a>
              )}
              <button
                onClick={() => setDocToDelete(doc)}
                disabled={deleting === doc.id}
                className="text-[#6E6678] hover:text-[#EF4444] p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                title="Delete document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}

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
