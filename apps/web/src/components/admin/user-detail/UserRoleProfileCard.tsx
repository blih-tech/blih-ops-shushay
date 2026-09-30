"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Languages,
  Briefcase,
  ExternalLink,
  Building2,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@blih/ui";
import type { AdminUserDetail } from "@/types/admin";

interface UserRoleProfileCardProps {
  user: AdminUserDetail;
}

export function UserRoleProfileCard({ user }: UserRoleProfileCardProps) {
  if (user.talentProfile) {
    const tp = user.talentProfile;
    return (
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#EBE5F0] flex items-center justify-between bg-[#FDFCFD]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#17131F]">
                Talent Profile Details
              </h2>
              <p className="text-xs text-[#6E6678]">
                Candidate background and qualifications
              </p>
            </div>
          </div>
          <Link href={`/admin/talents/${tp.id}`}>
            <Button size="sm" variant="ghost" className="text-xs">
              View Full Profile →
            </Button>
          </Link>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8]">
              Professional Title
            </div>
            <div className="text-base font-semibold text-[#17131F] mt-1">
              {tp.title || "No professional title set"}
            </div>
          </div>

          {tp.bio && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-1.5">
                Bio Summary
              </div>
              <div className="p-3.5 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] text-sm text-[#4A4453] leading-relaxed italic">
                "{tp.bio}"
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#F4EFF7]">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#6E6678] shrink-0" />
              <div>
                <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                  Location
                </div>
                <div className="text-xs font-medium text-[#17131F]">
                  {[tp.city, tp.country].filter(Boolean).join(", ") ||
                    "Not specified"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Languages className="h-4 w-4 text-[#6E6678] shrink-0" />
              <div>
                <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                  English Level
                </div>
                <div className="text-xs font-medium text-[#17131F]">
                  {tp.englishLevel || "Not provided"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4 text-[#6E6678] shrink-0" />
              <div>
                <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                  Applications
                </div>
                <div className="text-xs font-medium text-[#17131F]">
                  {tp._count?.jobApplications ?? 0} active
                </div>
              </div>
            </div>
          </div>

          {tp.skills && tp.skills.length > 0 && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-2.5">
                Listed Skills ({tp.skills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tp.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F0EEF8] text-[#5A506B] border border-[#E2DCED]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (user.companyProfile) {
    const cp = user.companyProfile;
    return (
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#EBE5F0] flex items-center justify-between bg-[#FDFCFD]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#17131F]">
                Company Profile Details
              </h2>
              <p className="text-xs text-[#6E6678]">
                Organization information and activity
              </p>
            </div>
          </div>
          <Link href={`/admin/companies/${cp.id}`}>
            <Button size="sm" variant="ghost" className="text-xs">
              View Full Profile →
            </Button>
          </Link>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8]">
              Company Name
            </div>
            <div className="text-base font-semibold text-[#17131F] mt-1">
              {cp.companyName}
            </div>
          </div>

          {cp.description && (
            <p className="text-sm text-[#4A4453] leading-relaxed">
              {cp.description}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#F4EFF7]">
            <div>
              <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                Website
              </div>
              {cp.website ? (
                <a
                  href={cp.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#1E5BFF] hover:underline mt-0.5"
                >
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <div className="text-xs text-[#6E6678]">None specified</div>
              )}
            </div>

            <div>
              <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                Location
              </div>
              <div className="text-xs font-medium text-[#17131F] mt-0.5">
                {[cp.city, cp.country].filter(Boolean).join(", ") || "—"}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                Jobs Published
              </div>
              <div className="text-xs font-medium text-[#17131F] mt-0.5">
                {cp._count?.jobs ?? 0} active openings
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-[#17131F]">
              Administrator Clearance & Privileges
            </h2>
            <p className="text-xs text-[#6E6678]">
              This account possesses global administrative access to the platform.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] text-xs text-[#4A4453] space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#2E8F79]" />
            <span>Full access to candidate, company, and job moderations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#2E8F79]" />
            <span>Curriculum management and manual skill access granting</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#2E8F79]" />
            <span>Payment tracking, audit logs, and account lifecycle controls</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
