"use client";

import React from "react";
import { Download, FileText, Paperclip } from "lucide-react";
import type { PublicLesson } from "@/types/course";

interface LearnReadingTabProps {
  activeLesson: PublicLesson;
}

export function LearnReadingTab({ activeLesson }: LearnReadingTabProps) {
  const hasContent = !!activeLesson.content;
  const hasDocuments = (activeLesson.documents?.length ?? 0) > 0;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 pb-4 border-b border-[#D9CEDF]">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
            {activeLesson.title}
          </h2>
          <p className="font-mono text-xs text-[#6E6678]">
            Reading Material & Documentation
          </p>
        </div>
      </div>

      {hasContent ? (
        <div className="prose max-w-none text-[#17131F] font-sans text-base sm:text-lg leading-relaxed whitespace-pre-wrap bg-[#F8FAFC]/50 p-6 sm:p-8 rounded-2xl border border-[#E2E8F0]">
          {activeLesson.content}
        </div>
      ) : (
        <p className="text-sm text-[#6E6678]">
          No written content for this step.
        </p>
      )}

      {hasDocuments && (
        <div className="space-y-3 pt-4 border-t border-[#D9CEDF]">
          <div className="flex items-center gap-2 text-[#17131F]">
            <Paperclip className="w-4 h-4 text-[#1E5BFF]" />
            <h4 className="font-display text-xs font-bold uppercase tracking-wider">
              Lesson Attachments & Downloads
            </h4>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeLesson.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={(doc as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#D9CEDF] hover:border-[#1E5BFF] hover:bg-[#EEF3FF] transition-all group bg-white shadow-2xs"
                >
                  <Download className="w-4 h-4 text-[#1E5BFF] flex-shrink-0" />
                  <span className="text-xs font-medium text-[#17131F] group-hover:text-[#1E5BFF] truncate">
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
