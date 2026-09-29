"use client";

import React from "react";
import Link from "next/link";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface JobApplicationsCardProps {
  applications: any[];
}

export function JobApplicationsCard({
  applications,
}: JobApplicationsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Candidate Applications
            </h2>
            <p className="text-xs text-[#6E6678]">
              Submitted talent profiles for this position
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#6E6678] bg-[#F4EFF7] px-2.5 py-1 rounded-md">
          {applications.length}{" "}
          {applications.length === 1 ? "Applicant" : "Applicants"}
        </span>
      </div>

      <div className="p-6">
        {applications.length > 0 ? (
          <div className="divide-y divide-[#F4EFF7] border border-[#EBE5F0] rounded-xl overflow-hidden">
            {applications.map((app) => {
              const tp = app.talentProfile;
              const name = tp?.fullName || tp?.user?.email || "Candidate";
              const email = tp?.user?.email;

              return (
                <div
                  key={app.id}
                  className="px-4 py-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFCFD] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#F4EFF7] border border-[#EBE5F0] text-[#17131F] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
                      {tp?.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tp.photoUrl}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#17131F] truncate">
                        {name}
                      </p>
                      {email && (
                        <p className="text-xs text-[#6E6678] truncate font-mono">
                          {email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <AdminStatusBadge
                        type="application"
                        value={app.status}
                        size="sm"
                      />
                      <div className="text-[11px] text-[#9E95A8] flex items-center gap-1 mt-1 justify-end font-mono">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {tp?.id && (
                      <Link href={`/admin/talents/${tp.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                        >
                          Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#D9CEDF] bg-[#FCFBFE]">
            <Users className="h-8 w-8 text-[#9E95A8] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-[#17131F]">
              No applications submitted yet
            </p>
            <p className="text-xs text-[#6E6678] mt-1 max-w-sm mx-auto">
              Candidates who apply for this job will appear here with review controls.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
