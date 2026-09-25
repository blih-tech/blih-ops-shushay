"use client";

import React from "react";
import { Download, FileText, Paperclip } from "lucide-react";
import type { PublicLesson } from "@/types/course";

interface LearnReadingStepProps {
  activeLesson: PublicLesson;
}

export function LearnReadingStep({ activeLesson }: LearnReadingStepProps) {
  const hasContent = !!activeLesson.content;
  const hasDocuments = (activeLesson.documents?.length ?? 0) > 0;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 pb-4 border-b border-[#D9CEDF]">
        <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center shrink-0 shadow-xs">
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
        <div className="prose max-w-none text-[#17131F] font-sans text-base sm:text-lg leading-relaxed whitespace-pre-wrap bg-white p-6 sm:p-8 rounded-xl border border-[#D9CEDF]">
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
            <Paperclip className="w-4 h-4 text-[#17131F]" />
            <h4 className="font-display text-xs font-bold uppercase tracking-wider">
              Lesson Attachments & Downloads
            </h4>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeLesson.documents.map((doc) => {
              const url = (doc as any).url || "";
              const extMatch = (doc.name || url).match(/\.([a-z0-9]+)$/i);
              const ext = extMatch ? extMatch[1].toUpperCase() : "FILE";

              return (
                <li key={doc.id}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#D9CEDF] hover:border-[#1E5BFF] hover:bg-[#F4F1F8] transition-all group bg-white shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Download className="w-4 h-4 text-[#17131F] flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#17131F] group-hover:text-[#1E5BFF] truncate font-display">
                        {doc.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] font-bold shrink-0">
                      {ext}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
