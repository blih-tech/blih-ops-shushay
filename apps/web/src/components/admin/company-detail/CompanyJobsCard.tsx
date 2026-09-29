"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Eye, Calendar, Clock } from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface CompanyJobsCardProps {
  jobs: any[];
}

export function CompanyJobsCard({ jobs }: CompanyJobsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Published Job Postings
            </h2>
            <p className="text-xs text-[#6E6678]">
              Active and past recruitment openings
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#6E6678] bg-[#F4EFF7] px-2.5 py-1 rounded-md">
          {jobs.length} {jobs.length === 1 ? "Listing" : "Listings"}
        </span>
      </div>

      <div className="p-6">
        {jobs.length > 0 ? (
          <div className="divide-y divide-[#F4EFF7] border border-[#EBE5F0] rounded-xl overflow-hidden">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="px-4 py-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFCFD] transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-[#17131F] truncate">
                      {job.title}
                    </span>
                    <AdminStatusBadge type="job" value={job.status} />
                    {job.employmentType && (
                      <span className="text-[11px] font-medium text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] px-2 py-0.5 rounded-md">
                        {job.employmentType}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6E6678]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      Posted{" "}
                      {new Date(job.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {job.applicationDeadline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        Deadline:{" "}
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Link href={`/admin/jobs/${job.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Eye className="h-3.5 w-3.5" />}
                    >
                      View Job
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#D9CEDF] bg-[#FCFBFE]">
            <Briefcase className="h-8 w-8 text-[#9E95A8] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-[#17131F]">
              No job postings recorded
            </p>
            <p className="text-xs text-[#6E6678] mt-1 max-w-sm mx-auto">
              This organization has not published any open roles on the platform yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
