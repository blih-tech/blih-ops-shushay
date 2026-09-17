"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  ArrowRight,
  Edit3,
  XCircle,
  RefreshCw,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Button, Skeleton } from "@blih/ui";
import { Job } from "@/types/job";

interface CompanyJobsTableProps {
  jobs: Job[];
  loading?: boolean;
  closingId?: string | null;
  reopeningId?: string | null;
  onCloseJob: (jobId: string) => void;
  onReopenJob: (jobId: string) => void;
}

function formatEmploymentType(type: string): string {
  if (!type) return "Full-Time";
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export function CompanyJobsTable({
  jobs,
  loading = false,
  closingId,
  reopeningId,
  onCloseJob,
  onReopenJob,
}: CompanyJobsTableProps) {
  if (loading) {
    return (
      <div className="bg-white border border-[#D9CEDF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9CEDF]/70 bg-[#FAF9FC] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#6E6678]">
                <th className="py-3.5 px-6">Role / Title</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Workplace</th>
                <th className="py-3.5 px-6">Applicants</th>
                <th className="py-3.5 px-6">Deadline</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CEDF]/40">
              {[0, 1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        variant="rectangular"
                        width={36}
                        height={36}
                        className="rounded-xl bg-[#EEF3FF]"
                      />
                      <div className="space-y-1">
                        <Skeleton
                          variant="rectangular"
                          width={140}
                          height={16}
                          className="rounded bg-[#EEF3FF]"
                        />
                        <Skeleton
                          variant="rectangular"
                          width={90}
                          height={12}
                          className="rounded bg-[#EEF3FF]"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={22}
                      className="rounded-full bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={16}
                      className="rounded bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={70}
                      height={16}
                      className="rounded bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={16}
                      className="rounded bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={32}
                        className="rounded-xl bg-[#EEF3FF]"
                      />
                      <Skeleton
                        variant="rectangular"
                        width={90}
                        height={32}
                        className="rounded-xl bg-[#EEF3FF]"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D9CEDF]/70 bg-[#FAF9FC] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#6E6678]">
              <th className="py-3.5 px-6">Role / Title</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Workplace</th>
              <th className="py-3.5 px-6">Applicants</th>
              <th className="py-3.5 px-6">Deadline</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9CEDF]/40 font-sans text-sm">
            {jobs.map((job) => {
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

              const deadlineFormatted = job.applicationDeadline
                ? new Date(job.applicationDeadline).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No deadline";

              return (
                <tr
                  key={job.id}
                  className="hover:bg-[#FAF9FC]/60 transition-colors duration-150"
                >
                  {/* Title & Role Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-2xs ${
                          isClosed
                            ? "bg-[#F4F1F7] text-[#6E6678] border border-[#D9CEDF]"
                            : "bg-gradient-to-br from-[#1E5BFF] to-[#0A3DCC] text-white"
                        }`}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <Link
                          href={`/company/jobs/${job.id}`}
                          className="font-display font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors truncate block"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-[#6E6678] font-mono truncate">
                          <span>{formatEmploymentType(job.employmentType)}</span>
                          {job.experienceLevel && (
                            <>
                              <span>·</span>
                              <span>{job.experienceLevel}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {isClosed ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#F4F1F7] text-[#6E6678] border border-[#D9CEDF]">
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
                        Active
                      </span>
                    )}
                  </td>

                  {/* Workplace & Location */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-[#17131F]">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
                      <span className="truncate max-w-[160px]">
                        {job.timezone ||
                          [job.companyProfile?.city, job.companyProfile?.country]
                            .filter(Boolean)
                            .join(", ") ||
                          "Remote"}
                      </span>
                    </div>
                    {job.workingHours && (
                      <span className="font-mono text-[10px] text-[#6E6678] block pt-0.5">
                        {job.workingHours}
                      </span>
                    )}
                  </td>

                  {/* Applicants Count */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17131F]">
                      <Users className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
                      <span>{applicantsCount}</span>
                      <span className="text-[#6E6678] font-normal">
                        {applicantsCount === 1 ? "applicant" : "applicants"}
                      </span>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-6 whitespace-nowrap text-xs text-[#6E6678] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6E6678] shrink-0" />
                      <span>{deadlineFormatted}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isClosed ? (
                        <>
                          <Link href={`/company/jobs/${job.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label="Edit role"
                              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                              className="h-8 px-2.5 text-xs font-semibold rounded-xl border-[#D9CEDF] text-[#17131F] hover:bg-[#F8FAFD] hover:border-[#1E5BFF]/40 transition-all"
                            >
                              Edit
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isClosing}
                            onClick={() => onCloseJob(job.id)}
                            className="h-8 px-2.5 text-xs font-semibold rounded-xl border-red-200/80 bg-red-50/50 text-red-600 hover:bg-red-100/80 hover:border-red-300 transition-all"
                            leftIcon={<XCircle className="w-3.5 h-3.5 text-red-500" />}
                          >
                            {isClosing ? "Closing..." : "Close"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isReopening}
                          onClick={() => onReopenJob(job.id)}
                          className="h-8 px-2.5 text-xs font-semibold rounded-xl border-[#D9CEDF] text-[#17131F] hover:bg-[#EEF3FF] hover:border-[#1E5BFF] hover:text-[#1E5BFF] transition-all"
                          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#1E5BFF]" />}
                        >
                          {isReopening ? "Reopening..." : "Reopen Role"}
                        </Button>
                      )}

                      <Link href={`/company/jobs/${job.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 px-3 text-xs font-semibold rounded-xl shadow-xs"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
