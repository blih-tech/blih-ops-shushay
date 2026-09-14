"use client";

import React, { useState } from "react";
import { formatPhone } from "@/lib/formatPhone";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  FileText,
  MapPin,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@blih/ui";
import { updateApplicationStatus } from "@/lib/jobApi";

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
      photoUrl?: string | null;
      experienceYears?: number | null;
      skills?: string[];
      englishLevel?: string | null;
      city?: string | null;
      country?: string | null;
      phone?: string | null;
      cvUrl?: string | null;
      user?: {
        email?: string;
      };
    } | null;
  };
  onStatusUpdated?: (updatedApp: any) => void;
}

function renderStatusBadge(status: string) {
  switch (status) {
    case "IN_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FFF4EE] text-[#FF8A5B] border border-[#FF8A5B]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A5B]" />
          Reviewing
        </span>
      );
    case "INTERVIEW_SCHEDULED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E6F5F0] text-[#2E8F79] border border-[#2E8F79]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E8F79]" />
          Interview Scheduled
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
          Applied
        </span>
      );
  }
}

export function CandidateApplicationCard({
  application: initialApp,
  onStatusUpdated,
}: CandidateApplicationCardProps) {
  const [appStatus, setAppStatus] = useState(initialApp.status);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const talent = initialApp.talentProfile;
  const name = talent?.fullName || "Candidate";
  const initial = name.charAt(0).toUpperCase() || "C";
  const location = [talent?.city, talent?.country].filter(Boolean).join(", ");
  const email = talent?.user?.email;
  const phone = talent?.phone;
  const photo = talent?.photoUrl || talent?.avatarUrl;

  const handleMoveToReviewing = async () => {
    setUpdating(true);
    setUpdateError(null);
    try {
      const updated = await updateApplicationStatus(initialApp.id, "IN_REVIEW");
      setAppStatus("IN_REVIEW");
      onStatusUpdated?.(updated);
    } catch (err: any) {
      console.error("Error updating status:", err);
      setUpdateError(err?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#D9CEDF] bg-white p-6 space-y-4 hover:border-[#1E5BFF]/40 transition-colors shadow-xs">
      {/* Top Header: Candidate Identity & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Circular Avatar */}
          {photo ? (
            <img
              src={photo}
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
                href={`/company/talents/${initialApp.talentProfileId}`}
                className="font-display text-lg font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors leading-tight line-clamp-1"
              >
                {name}
              </Link>
              {renderStatusBadge(appStatus)}
            </div>

            <p className="text-sm font-medium text-[#4A4154]">
              {talent?.title || "Technical Specialist"}
            </p>

            {/* Quick Metadata & Contact Row */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#6E6678] flex-wrap pt-0.5">
              {email && (
                <span className="flex items-center gap-1 text-[#17131F]">
                  <Mail className="w-3.5 h-3.5 text-[#1E5BFF]" />
                  {email}
                </span>
              )}

              {phone && (
                <span className="flex items-center gap-1 text-[#17131F]">
                  <Phone className="w-3.5 h-3.5 text-[#2E8F79]" />
                  {formatPhone(phone)}
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

        {/* Action Buttons: Status Change & View Profile */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {appStatus === "SUBMITTED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveToReviewing}
              disabled={updating}
              className="h-9 px-3 text-xs font-semibold border-[#FF8A5B]/40 text-[#FF8A5B] hover:bg-[#FFF4EE]"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              {updating ? "Updating..." : "Mark as Reviewing"}
            </Button>
          )}

          {talent?.cvUrl && (
            <a
              href={talent.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-semibold"
                leftIcon={<FileText className="w-3.5 h-3.5" />}
              >
                CV
              </Button>
            </a>
          )}

          {initialApp.talentProfileId && (
            <Link href={`/company/talents/${initialApp.talentProfileId}`}>
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

      {updateError && (
        <p className="text-xs font-mono text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {updateError}
        </p>
      )}

      {/* Candidate Cover Statement */}
      {initialApp.coverLetter && (
        <div className="rounded-xl bg-[#F8FAFD] border border-[#E6EAF3] p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#6E6678] uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#1E5BFF]" />
            <span>Candidate Statement</span>
          </div>
          <p className="text-sm text-[#352D3D] leading-relaxed font-sans whitespace-pre-line">
            "{initialApp.coverLetter}"
          </p>
        </div>
      )}

      {/* Footer: Candidate Verified Skills & Application Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E6EAF3] text-xs">
        {/* Skills */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {talent?.skills && talent.skills.length > 0 ? (
            <>
              <span className="text-xs font-mono text-[#6E6678] mr-1">
                Skills:
              </span>
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
            {new Date(initialApp.createdAt).toLocaleDateString("en-US", {
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
