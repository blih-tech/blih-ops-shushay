"use client";

import React, { useState, useRef } from "react";
import { Video, CheckCircle2, Upload, Trash2, Eye, EyeOff, Film } from "lucide-react";
import { Button, Alert, ConfirmDialog } from "@blih/ui";
import { uploadLessonVideo, deleteLessonVideo } from "@/lib/courses";
import type { Lesson } from "@/types/course";
import { SectionCard } from "./SectionCard";
import { UploadProgressCard } from "./UploadProgressCard";
import { getErrorMessage } from "@/lib/errorUtils";

interface VideoSectionProps {
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

function getFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split("/");
    const filename = parts[parts.length - 1];
    if (filename && filename.length > 2) {
      const decoded = decodeURIComponent(filename);
      const cleaned = decoded.replace(/^v\d+_\d+_/i, "").replace(/^[a-z0-9]{20,}_/i, "");
      return cleaned.includes(".") ? cleaned : `${cleaned}.mp4`;
    }
  } catch {
    const parts = url.split("/");
    const last = parts[parts.length - 1];
    if (last) return last;
  }
  return "lecture_video.mp4";
}

export function VideoSection({
  courseId,
  lesson,
  onUpdate,
}: VideoSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadFile(file);
    setUploadProgress(10);
    setError(null);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 12) + 5;
      });
    }, 300);

    try {
      const updated = await uploadLessonVideo(courseId, lesson.id, file);
      clearInterval(timer);
      setUploadProgress(100);
      setTimeout(() => {
        onUpdate(updated);
        setUploading(false);
        setUploadFile(null);
        setUploadProgress(0);
      }, 400);
    } catch (e: unknown) {
      clearInterval(timer);
      setError(getErrorMessage(e) ?? "Video upload failed");
      setUploading(false);
      setUploadFile(null);
      setUploadProgress(0);
    }
  }

  async function handleDelete() {
    setConfirmDelete(false);
    setDeleting(true);
    setError(null);
    try {
      await deleteLessonVideo(courseId, lesson.id);
      onUpdate({ ...lesson, videoUrl: null });
      setShowPreview(false);
    } catch (e: unknown) {
      setError(getErrorMessage(e) ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const fileName = lesson.videoUrl ? getFileNameFromUrl(lesson.videoUrl) : "";

  return (
    <SectionCard title="Video Lesson" icon={<Video className="h-4 w-4" />}>
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Uploading Progress Active State */}
      {uploading && uploadFile ? (
        <UploadProgressCard
          fileName={uploadFile.name}
          fileSize={formatBytes(uploadFile.size)}
          progress={uploadProgress}
          type="video"
          statusText="Uploading video & processing stream..."
        />
      ) : lesson.videoUrl ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#1E5BFF]/10 text-[#1E5BFF] flex items-center justify-center shrink-0 border border-[#1E5BFF]/20">
                <Film className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-[#17131F] font-display truncate max-w-[240px] sm:max-w-xs" title={fileName}>
                    {fileName}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ready for streaming
                  </span>
                </div>
                <p className="text-xs font-mono text-[#6E6678] mt-0.5">
                  Video Attached 
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview((prev) => !prev)}
                leftIcon={showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              >
                {showPreview ? "Hide Preview" : "Preview"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                isLoading={uploading}
                onClick={() => fileRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828] transition-colors"
                isLoading={deleting}
                onClick={() => setConfirmDelete(true)}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Collapsible Video Preview Surface */}
          {showPreview && (
            <div className="p-3 bg-[#0F172A] rounded-2xl overflow-hidden border border-[#334155] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-[#334155] mb-2 text-xs text-slate-400 font-mono">
                <span>Video Stream Preview</span>
                <span className="truncate max-w-xs">{fileName}</span>
              </div>
              <video
                src={lesson.videoUrl}
                controls
                controlsList="nodownload"
                className="w-full max-h-[320px] rounded-xl bg-black object-contain"
              >
                Your browser does not support HTML5 video streaming.
              </video>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#D9CEDF] hover:border-[#1E5BFF]/50 bg-[#EEF3FF]/30 hover:bg-[#EEF3FF]/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9CEDF] group-hover:border-[#1E5BFF] flex items-center justify-center text-[#1E5BFF] transition-colors shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-[#17131F] font-display">
            Click to upload lecture video
          </p>
          <p className="text-xs font-mono text-[#6E6678]">
            MP4, WebM format up to 500MB supported
          </p>
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

      {/* Custom Blih UI Confirm Modal */}
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Lecture Video"
        message="Are you sure you want to delete this lecture video? The video stream will be permanently removed."
        confirmText="Delete Video"
        variant="destructive"
      />
    </SectionCard>
  );
}
