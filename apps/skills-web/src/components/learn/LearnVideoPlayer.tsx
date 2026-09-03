"use client";

import React from "react";
import { Play, Download } from "lucide-react";
import type { PublicLesson } from "@/types/course";

interface LearnVideoPlayerProps {
  activeLesson: PublicLesson;
}

export function LearnVideoPlayer({ activeLesson }: LearnVideoPlayerProps) {
  const hasVideo = !!activeLesson.videoUrl;
  const hasDocuments = (activeLesson.documents?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {hasVideo ? (
        <div className="w-full aspect-video bg-[#17131F] rounded-3xl overflow-hidden shadow-xl">
          <video
            src={activeLesson.videoUrl!}
            controls
            className="w-full h-full object-contain"
            controlsList="nodownload"
          />
        </div>
      ) : (
        <div className="w-full aspect-video bg-[#F8F6FA] rounded-3xl flex flex-col items-center justify-center border border-[#D9CEDF]">
          <Play className="w-10 h-10 text-[#D9CEDF] mb-3" />
          <p className="text-sm text-[#6E6678]">No video available for this lesson</p>
        </div>
      )}

      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-display text-xl font-bold text-[#17131F]">
          {activeLesson.title}
        </h3>
        {activeLesson.content && (
          <p className="font-sans text-sm text-[#6E6678] leading-relaxed whitespace-pre-wrap">
            {activeLesson.content}
          </p>
        )}
      </div>

      {hasDocuments && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-3 shadow-sm">
          <h4 className="font-display text-xs font-bold text-[#17131F] uppercase tracking-wider">
            Downloadable Resources
          </h4>
          <ul className="space-y-2">
            {activeLesson.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={(doc as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#D9CEDF] hover:bg-[#EEF3FF] transition-colors group"
                >
                  <Download className="w-4 h-4 text-[#1E5BFF] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#17131F] group-hover:text-[#1E5BFF] truncate">
                    {doc.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
