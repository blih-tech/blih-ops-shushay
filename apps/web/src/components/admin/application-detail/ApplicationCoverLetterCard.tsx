"use client";

import React from "react";
import { MessageSquareText, FileText, ExternalLink } from "lucide-react";

interface ApplicationCoverLetterCardProps {
  application: any;
}

export function ApplicationCoverLetterCard({
  application,
}: ApplicationCoverLetterCardProps) {
  const cvUrl = application.talentProfile?.cvUrl;

  return (
    <div className="space-y-6">
      {/* Cover Letter */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
              <MessageSquareText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#17131F]">
                Candidate Cover Letter
              </h2>
              <p className="text-xs text-[#6E6678]">
                Personal statement and motivation submitted with this application
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {application.coverLetter ? (
            <div className="p-5 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] text-sm text-[#3E3847] leading-relaxed whitespace-pre-line font-sans">
              {application.coverLetter}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#6E6678] italic rounded-xl border border-dashed border-[#EBE5F0] bg-[#FCFBFE]">
              No cover letter was submitted with this application.
            </div>
          )}
        </div>
      </div>

      {/* Resume Section if available */}
      {cvUrl && (
        <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display font-bold text-sm text-[#17131F]">
                  Attached Resume / CV
                </h2>
                <p className="text-xs text-[#6E6678]">
                  Candidate curriculum vitae
                </p>
              </div>
            </div>

            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E5BFF] bg-[#EEF3FF] hover:bg-[#DDE7FF] px-3.5 py-2 rounded-xl border border-[#1E5BFF]/15 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Open Document
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
