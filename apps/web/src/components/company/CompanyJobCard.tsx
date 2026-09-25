"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  DollarSign,
  Users,
  ArrowRight,
  Edit3,
  Calendar,
  XCircle,
  Sparkles,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import { Button } from "@blih/ui";
import { Job } from "@/types/job";
import { formatSalary } from "@/lib/jobOptions";

interface CompanyJobCardProps {
  job: Job;
  closingId: string | null;
  reopeningId?: string | null;
  onCloseJob: (jobId: string) => void;
  onReopenJob?: (jobId: string) => void;
}

function formatEmploymentType(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export function CompanyJobCard({
  job,
  closingId,
  reopeningId,
  onCloseJob,
  onReopenJob,
}: CompanyJobCardProps) {
  const isClosed = job.status === "CLOSED";
  const isExpired =
    !isClosed &&
    Boolean(
      job.applicationDeadline &&
      new Date(job.applicationDeadline) < new Date()
    );
  const applicantsCount = job._count?.applications || 0;
  const isClosing = closingId === job.id;
  const isReopening = reopeningId === job.id;
  const initial = job.title ? job.title.charAt(0).toUpperCase() : "J";

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#D9CEDF] bg-white shadow-xs">
      <div className="p-6 sm:p-7 space-y-5">
        {/* Header: Role Title, Status Badge & Top Action Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Vibrant Monogram Badge */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-xl shrink-0 shadow-sm ${isClosed
                  ? "bg-[#F4F1F7] text-[#6E6678] border border-[#D9CEDF]"
                  : "bg-gradient-to-br from-[#1E5BFF] to-[#0A3DCC] text-white shadow-[0_4px_12px_rgba(30,91,255,0.25)] ring-4 ring-[#EEF3FF]"
                }`}
            >
              {initial}
            </div>

            <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
              <Link href={`/company/jobs/${job.id}`} className="inline-block">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors leading-tight line-clamp-1">
                  {job.title}
                </h3>
              </Link>

              {isClosed ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#F4F1F7] text-[#6E6678] border border-[#D9CEDF]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E6678]" />
                  Closed
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#FFF9EB] text-[#DDAA3C] border border-[#DDAA3C]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DDAA3C]" />
                  Expired
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#E6F5F0] text-[#2E8F79] border border-[#2E8F79]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E8F79] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E8F79]" />
                  </span>
                  Active Role
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons at the TOP */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap self-start sm:self-auto">
            {!isClosed ? (
              <>
                <Link href={`/company/jobs/${job.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Edit role"
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    className="px-3.5 text-xs font-semibold rounded-xl border-[#D9CEDF] text-[#17131F] hover:bg-[#F8FAFD] hover:border-[#1E5BFF]/40 transition-all"
                  >
                    Edit
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isClosing}
                  onClick={() => onCloseJob(job.id)}
                  className="px-3.5 text-xs font-semibold rounded-xl border-red-200/80 bg-red-50/50 text-red-600 hover:bg-red-100/80 hover:border-red-300 transition-all"
                  leftIcon={<XCircle className="w-3.5 h-3.5 text-red-500" />}
                >
                  {isClosing ? "Closing..." : "Close"}
                </Button>
              </>
            ) : (
              onReopenJob && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isReopening}
                  onClick={() => onReopenJob(job.id)}
                  className="px-3.5 text-xs font-semibold rounded-xl border-[#D9CEDF] text-[#17131F] hover:bg-[#EEF3FF] hover:border-[#1E5BFF] hover:text-[#1E5BFF] transition-all"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#1E5BFF]" />}
                >
                  {isReopening ? "Reopening..." : "Reopen Role"}
                </Button>
              )
            )}

            <Link href={`/company/jobs/${job.id}`}>
              <Button
                variant="primary"
                size="sm"
                className="px-4 text-xs font-semibold rounded-xl shadow-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Manage Role
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Micro-Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#F8FAFD] via-white to-[#F8FAFD] border border-[#E6EAF3]">
          {/* Role Type & Level */}
          <div className="space-y-0.5 px-2">
            <span className="text-[10px] font-mono text-[#6E6678] uppercase tracking-wider block">
              Role Profile
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17131F] truncate">
              <Briefcase className="w-4 h-4 text-[#1E5BFF] shrink-0" />
              <span className="truncate">
                {formatEmploymentType(job.employmentType)} · {job.experienceLevel} Level
              </span>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-0.5 px-2 lg:border-l lg:border-[#E6EAF3]">
            <span className="text-[10px] font-mono text-[#6E6678] uppercase tracking-wider block">
              Compensation
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17131F] truncate">
              <DollarSign className="w-4 h-4 text-[#2E8F79] shrink-0" />
              <span className="truncate">{formatSalary(job)}</span>
            </div>
          </div>

          {/* Location & Schedule */}
          <div className="space-y-0.5 px-2 lg:border-l lg:border-[#E6EAF3]">
            <span className="text-[10px] font-mono text-[#6E6678] uppercase tracking-wider block">
              Location & Schedule
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#17131F] truncate">
              <MapPin className="w-4 h-4 text-[#1E5BFF] shrink-0" />
              <span className="truncate">
                {job.timezone || "Remote"}
                {job.workingHours ? ` · ${job.workingHours}` : ""}
              </span>
            </div>
          </div>

          {/* Applicant Spotlight */}
          <div className="space-y-0.5 px-2 lg:border-l lg:border-[#E6EAF3]">
            <span className="text-[10px] font-mono text-[#6E6678] uppercase tracking-wider block">
              Applicant Pool
            </span>
            <Link
              href={`/company/jobs/${job.id}`}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] hover:underline truncate"
            >
              <Users className="w-4 h-4 text-[#1E5BFF] shrink-0" />
              <span>
                {applicantsCount}{" "}
                {applicantsCount === 1 ? "Candidate" : "Candidates"}
              </span>
            </Link>
          </div>
        </div>

        {/* Footer: Skills on left, Post Date on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E6EAF3]">
          {/* Skills as clean dot-separated text */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
            <span className="text-xs font-mono text-[#6E6678] truncate">
              <span className="text-[#17131F] font-semibold">Required: </span>
              {job.requiredSkills && job.requiredSkills.length > 0 ? (
                <>
                  {job.requiredSkills.slice(0, 4).join(" · ")}
                  {job.requiredSkills.length > 4 && (
                    <span className="text-[#1E5BFF] font-medium ml-1">
                      (+{job.requiredSkills.length - 4} more)
                    </span>
                  )}
                </>
              ) : (
                "General role requirements"
              )}
            </span>
          </div>

          {/* Post Date at the BOTTOM */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#6E6678] shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#6E6678]/70" />
            <span>
              Posted{" "}
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
