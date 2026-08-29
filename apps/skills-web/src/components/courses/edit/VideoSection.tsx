import React, { useState, useRef } from "react";
import { Video, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { Button, Alert } from "@blih/ui";
import { uploadLessonVideo, deleteLessonVideo } from "@/lib/courses";
import type { Lesson } from "@/types/course";
import { SectionCard } from "./SectionCard";

interface VideoSectionProps {
  courseId: string;
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
}

export function VideoSection({ courseId, lesson, onUpdate }: VideoSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteLessonVideo(courseId, lesson.id);
      onUpdate({ ...lesson, videoUrl: null });
    } catch (e: any) {
      setError(e.message ?? "Delete failed");
    } finally {
      setDeleting(false);
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
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
              Replace Video
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828] transition-colors"
              isLoading={deleting}
              onClick={handleDelete}
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete
            </Button>
          </div>
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
