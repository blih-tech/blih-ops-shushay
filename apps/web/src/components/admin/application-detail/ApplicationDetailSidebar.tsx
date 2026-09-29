"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  Building2,
  Mail,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface ApplicationDetailSidebarProps {
  application: any;
}

export function ApplicationDetailSidebar({
  application,
}: ApplicationDetailSidebarProps) {
  const tp = application.talentProfile;
  const job = application.job;
  const candidateName = tp?.fullName || tp?.user?.email || "Candidate";
  const location = [tp?.city, tp?.country].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      {/* Candidate Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#1E5BFF]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Candidate Details
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Full Name
            </div>
            <div className="font-semibold text-sm text-[#17131F]">
              {candidateName}
            </div>
            {tp?.title && (
              <div className="text-xs text-[#6E6678] mt-0.5">{tp.title}</div>
            )}
          </div>

          {tp?.user?.email && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <Mail className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span className="truncate font-mono">{tp.user.email}</span>
            </div>
          )}

          {location && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <MapPin className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {tp?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/talents/${tp.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between text-xs"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  View Full Talent Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Target Job & Company Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#2E8F79]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Target Job & Employer
            </h2>
          </div>
          {job?.status && <AdminStatusBadge type="job" value={job.status} />}
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Role Position
            </div>
            <div className="font-semibold text-sm text-[#17131F]">
              {job?.title || "Job Listing"}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
            <Building2 className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
            <span className="font-medium text-[#17131F]">
              {job?.companyProfile?.companyName || "Organization"}
            </span>
          </div>

          {job?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/jobs/${job.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between text-xs"
                  rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                >
                  View Job Details
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
