"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  FileText,
  MapPin,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@blih/ui";

interface CandidateApplicationCardProps {
  application: {
    id: string;
    jobId: string;
    talentProfileId: string;
    status: string;
    coverLetter?: string | null;
    createdAt: string | Date;
    talentProfile?: {
      id: string;
      fullName?: string | null;
      title?: string | null;
      avatarUrl?: string | null;
      experienceYears?: number | null;
      skills?: string[];
      englishLevel?: string | null;
      city?: string | null;
      country?: string | null;
      user?: {
        email?: string;
      };
    } | null;
  };
}

function renderStatusBadge(status: string) {
  switch (status) {
    case "SHORTLISTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E6F5F0] text-[#2E8F79] border border-[#2E8F79]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E8F79]" />
          Shortlisted
        </span>
      );
    case "REVIEWED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FFF4EE] text-[#FF8A5B] border border-[#FF8A5B]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A5B]" />
          In Review
        </span>
      );
    case "HIRED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#EEF3FF] text-[#1E5BFF] border border-[#1E5BFF]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BFF]" />
          Hired
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#F4F1F7] text-[#6E6678] border border-[#D9CEDF]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6E6678]" />
          Declined
        </span>
      );
    case "SUBMITTED":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#EEF3FF] text-[#1E5BFF] border border-[#1E5BFF]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BFF]" />
          Application Received
        </span>
      );
  }
}

export function CandidateApplicationCard({ application: app }: CandidateApplicationCardProps) {
  const talent = app.talentProfile;
  const name = talent?.fullName || "Candidate";
  const initial = name.charAt(0).toUpperCase() || "C";
  const location = [talent?.city, talent?.country].filter(Boolean).join(", ");

  return (
    <div className="rounded-2xl border border-[#D9CEDF] bg-white p-6 space-y-4 hover:border-[#1E5BFF]/40 transition-colors shadow-xs">
      {/* Top Header: Candidate Identity & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Circular Avatar */}
          {talent?.avatarUrl ? (
            <img
              src={talent.avatarUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#EEF3FF] shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E5BFF] to-[#0A3DCC] text-white flex items-center justify-center font-display font-bold text-lg ring-2 ring-[#EEF3FF] shrink-0 shadow-xs">
              {initial}
            </div>
          )}

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href={`/company/talents/${app.talentProfileId}`}
                className="font-display text-lg font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors leading-tight line-clamp-1"
              >
                {name}
              </Link>
              {renderStatusBadge(app.status)}
            </div>

            <p className="text-sm font-medium text-[#4A4154]">
              {talent?.title || "Professional"}
            </p>

            {/* Quick Metadata Row */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#6E6678] flex-wrap pt-0.5">
              {talent?.experienceYears !== undefined && talent?.experienceYears !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#6E6678]/70" />
                  {talent.experienceYears}y experience
                </span>
              )}

              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6E6678]/70" />
                  {location}
                </span>
              )}

              {talent?.englishLevel && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#6E6678]/70" />
                  {talent.englishLevel} English
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Profile Action */}
        <div className="shrink-0 self-start sm:self-center">
          {app.talentProfileId && (
            <Link href={`/company/talents/${app.talentProfileId}`}>
              <Button
                variant="primary"
                size="sm"
                className="h-9 px-4 text-xs font-semibold shadow-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Profile
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Candidate Cover Statement */}
      {app.coverLetter && (
        <div className="rounded-xl bg-[#F8FAFD] border border-[#E6EAF3] p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#6E6678] uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#1E5BFF]" />
            <span>Candidate Statement</span>
          </div>
          <p className="text-sm text-[#352D3D] leading-relaxed font-sans whitespace-pre-line">
            "{app.coverLetter}"
          </p>
        </div>
      )}

      {/* Footer: Candidate Verified Skills & Application Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E6EAF3] text-xs">
        {/* Skills */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {talent?.skills && talent.skills.length > 0 ? (
            <>
              <span className="text-xs font-mono text-[#6E6678] mr-1">Skills:</span>
              {talent.skills.slice(0, 6).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-[#F4F1F7] text-[#4A4154] font-mono text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {talent.skills.length > 6 && (
                <span className="px-1.5 py-0.5 text-xs font-mono text-[#6E6678]">
                  +{talent.skills.length - 6} more
                </span>
              )}
            </>
          ) : (
            <span className="text-xs font-mono text-[#6E6678]/70">
              Verified Candidate
            </span>
          )}
        </div>

        {/* Application Date */}
        <div className="flex items-center gap-1.5 font-mono text-[#6E6678] shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#6E6678]/70" />
          <span>
            Applied{" "}
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
