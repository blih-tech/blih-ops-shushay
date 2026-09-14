"use client";

import React from "react";
import { Download } from "lucide-react";
import type { PublicLesson } from "@/types/course";

interface LearnReadingTabProps {
  activeLesson: PublicLesson;
}

export function LearnReadingTab({ activeLesson }: LearnReadingTabProps) {
  const hasContent = !!activeLesson.content;
  const hasDocuments = (activeLesson.documents?.length ?? 0) > 0;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
        {activeLesson.title}
      </h2>
      {hasContent ? (
        <div className="prose max-w-none text-[#17131F] font-sans leading-relaxed whitespace-pre-wrap">
          {activeLesson.content}
        </div>
      ) : (
        <p className="text-sm text-[#6E6678]">
          No written content for this lesson.
        </p>
      )}

      {hasDocuments && (
        <div className="space-y-3 pt-4 border-t border-[#D9CEDF]">
          <h4 className="font-display text-xs font-bold text-[#17131F] uppercase tracking-wider">
            Lesson Attachments
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
