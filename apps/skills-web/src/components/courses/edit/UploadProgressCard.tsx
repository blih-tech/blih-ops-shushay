"use client";

import React from "react";
import { Loader2, UploadCloud, FileText, Video } from "lucide-react";

interface UploadProgressCardProps {
  fileName: string;
  fileSize?: string;
  progress: number;
  type: "video" | "document";
  statusText?: string;
}

export function UploadProgressCard({
  fileName,
  fileSize,
  progress,
  type,
  statusText,
}: UploadProgressCardProps) {
  const Icon = type === "video" ? Video : FileText;

  return (
    <div className="bg-[#EEF3FF]/70 border-2 border-[#1E5BFF]/30 rounded-2xl p-5 space-y-4 shadow-sm animate-pulse-subtle">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#1E5BFF] text-white flex items-center justify-center shrink-0 shadow-md">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[#1E5BFF] shrink-0" />
              <p className="text-sm font-bold text-[#17131F] font-display truncate">
                {fileName}
              </p>
            </div>
            <p className="text-xs font-mono text-[#6E6678] pt-0.5">
              {statusText ?? (type === "video" ? "Uploading & Processing Video..." : "Uploading Document...")}
              {fileSize && ` · ${fileSize}`}
            </p>
          </div>
        </div>
        <span className="font-mono text-sm font-bold text-[#1E5BFF] shrink-0 bg-white px-2.5 py-1 rounded-lg border border-[#D9CEDF]">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#D9CEDF]/60 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-[#1E5BFF] to-[#2E8F79] h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-[#6E6678]">
          <span>Cloud Storage Upload</span>
          <span>Please keep window open</span>
        </div>
      </div>
    </div>
  );
}
