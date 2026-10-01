"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  XCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminJobDetail } from "@/types/admin";

interface JobDetailHeaderProps {
  job: AdminJobDetail;
  actionLoading: boolean;
  onCloseClick: () => void;
  onReopenClick: () => void;
  onDeleteClick: () => void;
}

export function JobDetailHeader({
  job,
  actionLoading,
  onCloseClick,
  onReopenClick,
  onDeleteClick,
}: JobDetailHeaderProps) {
  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const location = [job.companyProfile.city, job.companyProfile.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
              {job.title}
            </h1>
            <AdminStatusBadge type="job" value={job.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
            <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-medium text-[#17131F]">
              <Building2 className="h-3.5 w-3.5 text-[#6E6678]" />
              {job.companyProfile.companyName || "Organization"}
            </span>

            {location && (
              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <MapPin className="h-3.5 w-3.5 text-[#6E6678]" />
                {location}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
              <Clock className="h-3.5 w-3.5 text-[#6E6678]" />
              {formatType(job.employmentType)}
            </span>

            <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
              <Calendar className="h-3.5 w-3.5 text-[#6E6678]" />
              Posted{" "}
              {new Date(job.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {job.status === "ACTIVE" ? (
            <Button
              size="md"
              variant="outline"
              className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828] border-red-200"
              leftIcon={<XCircle className="h-4 w-4" />}
              onClick={onCloseClick}
              isLoading={actionLoading}
            >
              Close Job
            </Button>
          ) : (
            <Button
              size="md"
              variant="secondary"
              leftIcon={<RefreshCw className="h-4 w-4 text-[#2E8F79]" />}
              onClick={onReopenClick}
              isLoading={actionLoading}
            >
              Reopen Job
            </Button>
          )}

          <Button
            size="md"
            variant="destructive"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={onDeleteClick}
            isLoading={actionLoading}
          >
            Delete Job
          </Button>
        </div>
      </div>
    </div>
  );
}
