"use client";

import React from "react";
import { FileText, Globe, ExternalLink } from "lucide-react";

interface TalentPortfolioCardProps {
  talent: any;
}

export function TalentPortfolioCard({ talent }: TalentPortfolioCardProps) {
  const hasLinks =
    talent.cvUrl ||
    talent.portfolioUrl ||
    talent.githubUrl ||
    talent.linkedinUrl;

  if (!hasLinks) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
          <Globe className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Portfolio & Documents
          </h2>
          <p className="text-xs text-[#6E6678]">
            External profiles and candidate resume
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        {talent.cvUrl && (
          <a
            href={talent.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E5BFF] bg-[#EEF3FF] hover:bg-[#DDE7FF] px-3.5 py-2 rounded-xl border border-[#1E5BFF]/15 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Resume / CV
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        )}

        {talent.portfolioUrl && (
          <a
            href={talent.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#17131F] bg-[#F9F8FC] hover:bg-[#EBE5F0] px-3.5 py-2 rounded-xl border border-[#D9CEDF] transition-colors"
          >
            <Globe className="h-4 w-4 text-[#6E6678]" />
            Portfolio Website
            <ExternalLink className="h-3 w-3 text-[#9E95A8]" />
          </a>
        )}

        {talent.githubUrl && (
          <a
            href={talent.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#17131F] bg-[#F9F8FC] hover:bg-[#EBE5F0] px-3.5 py-2 rounded-xl border border-[#D9CEDF] transition-colors"
          >
            <Globe className="h-4 w-4 text-[#6E6678]" />
            GitHub
            <ExternalLink className="h-3 w-3 text-[#9E95A8]" />
          </a>
        )}

        {talent.linkedinUrl && (
          <a
            href={talent.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#0A66C2] bg-[#F0F7FF] hover:bg-[#E1EFFF] px-3.5 py-2 rounded-xl border border-[#0A66C2]/20 transition-colors"
          >
            <Globe className="h-4 w-4 text-[#0A66C2]" />
            LinkedIn
            <ExternalLink className="h-3 w-3 text-[#0A66C2]/70" />
          </a>
        )}
      </div>
    </div>
  );
}
