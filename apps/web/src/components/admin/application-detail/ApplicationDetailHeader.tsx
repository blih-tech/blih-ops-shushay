"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Building2, Calendar, User, ExternalLink } from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface ApplicationDetailHeaderProps {
  application: any;
}

export function ApplicationDetailHeader({
  application,
}: ApplicationDetailHeaderProps) {
  const tp = application.talentProfile;
  const job = application.job;
  const applicantName = tp?.fullName || tp?.user?.email || "Unknown Candidate";
  const jobTitle = job?.title || "Job Listing";
  const companyName = job?.companyProfile?.companyName || "Organization";

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0 overflow-hidden">
            {tp?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tp.photoUrl}
                alt={applicantName}
                className="w-full h-full object-cover"
              />
            ) : (
              applicantName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                {applicantName}
              </h1>
              <AdminStatusBadge
                type="application"
                value={application.status}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-medium text-[#17131F]">
                <Briefcase className="h-3.5 w-3.5 text-[#6E6678]" />
                {jobTitle}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Building2 className="h-3.5 w-3.5 text-[#6E6678]" />
                {companyName}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-[#6E6678]" />
                Submitted{" "}
                {new Date(application.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {tp?.id && (
            <Link href={`/admin/talents/${tp.id}`}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<User className="h-3.5 w-3.5" />}
              >
                Candidate Profile
              </Button>
            </Link>
          )}

          {job?.id && (
            <Link href={`/admin/jobs/${job.id}`}>
              <Button
                size="sm"
                variant="outline"
                rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
              >
                View Job
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
