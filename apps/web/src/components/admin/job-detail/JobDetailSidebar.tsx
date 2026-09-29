"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminJobDetail } from "@/types/admin";

interface JobDetailSidebarProps {
  job: AdminJobDetail;
  onDeleteClick: () => void;
}

export function JobDetailSidebar({ job, onDeleteClick }: JobDetailSidebarProps) {
  const cp = job.companyProfile;
  const location = [cp.city, cp.country].filter(Boolean).join(", ");
  const sub = cp.companySubscription;

  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const salaryDisplay =
    job.salaryDisplay ||
    (job.salaryMin
      ? `${job.salaryCurrency} ${job.salaryMin}${job.salaryMax ? `–${job.salaryMax}` : "+"}`
      : "Not Disclosed");

  return (
    <div className="space-y-6">
      {/* Hiring Company Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#2E8F79]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Hiring Organization
            </h2>
          </div>
          {sub && <AdminStatusBadge type="subscription" value={sub.status} />}
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Company Name
            </div>
            <div className="font-semibold text-sm text-[#17131F]">
              {cp.companyName || "Organization"}
            </div>
          </div>

          {cp.user?.email && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <Mail className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span className="truncate font-mono">{cp.user.email}</span>
            </div>
          )}

          {location && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <MapPin className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {cp.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/companies/${cp.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between text-xs"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  View Company Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Role Specifications Summary */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#1E5BFF]" />
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Job Specifications
          </h2>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#6E6678]">Employment Type</span>
            <span className="font-semibold text-[#17131F]">
              {formatType(job.employmentType)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Experience Tier</span>
            <span className="font-semibold text-[#17131F]">
              {formatType(job.experienceLevel)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Compensation</span>
            <span className="font-semibold text-[#17131F] truncate max-w-[150px] text-right">
              {salaryDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Date Published</span>
            <span className="font-medium text-[#17131F]">
              {new Date(job.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Application Deadline</span>
            <span className="font-medium text-[#17131F]">
              {job.applicationDeadline
                ? new Date(job.applicationDeadline).toLocaleDateString()
                : "Open"}
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/40 rounded-2xl border border-red-200/80 p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <h2 className="font-display font-bold text-sm">Danger Zone</h2>
        </div>
        <p className="text-xs text-red-600/90 leading-relaxed">
          Permanently delete this job listing. All associated candidate applications and review logs will be irrevocably purged.
        </p>
        <Button
          size="sm"
          variant="destructive"
          className="w-full justify-center"
          onClick={onDeleteClick}
          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
        >
          Delete Job Listing
        </Button>
      </div>
    </div>
  );
}
