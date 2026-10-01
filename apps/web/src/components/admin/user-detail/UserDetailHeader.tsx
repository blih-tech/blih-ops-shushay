"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Calendar,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Building2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@blih/ui";
import type { AdminUserDetail } from "@/types/admin";

interface UserDetailHeaderProps {
  user: AdminUserDetail;
  displayName: string;
  onDeleteClick: () => void;
}

export function UserDetailHeader({
  user,
  displayName,
  onDeleteClick,
}: UserDetailHeaderProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  const roleStyles = {
    ADMIN: "bg-[#7B2CBF]/10 text-[#7B2CBF] border-[#7B2CBF]/30",
    COMPANY: "bg-[#2E8F79]/10 text-[#2E8F79] border-[#2E8F79]/30",
    TALENT: "bg-[#1E5BFF]/10 text-[#1E5BFF] border-[#1E5BFF]/30",
  }[user.role as "ADMIN" | "COMPANY" | "TALENT"] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0 overflow-hidden">
            {user.talentProfile?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.talentProfile.photoUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : user.companyProfile?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.companyProfile.logoUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                {displayName}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${roleStyles}`}
              >
                {user.role === "ADMIN" ? (
                  <Shield className="h-3 w-3" />
                ) : user.role === "COMPANY" ? (
                  <Building2 className="h-3 w-3" />
                ) : (
                  <UserCheck className="h-3 w-3" />
                )}
                {user.role}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  user.emailVerified
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Verified
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    Unverified
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6E6678]">
              <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-mono">
                <Mail className="h-3.5 w-3.5 text-[#6E6678]" />
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-[#1E5BFF] transition-colors"
                >
                  {user.email}
                </a>
                <button
                  onClick={copyEmail}
                  className="text-[#9E95A8] hover:text-[#17131F] transition-colors ml-1 p-0.5"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="h-3 w-3 text-[#2E8F79]" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-[#6E6678]" />
                <span>
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {user.talentProfile && (
            <Link href={`/admin/talents/${user.talentProfile.id}`}>
              <Button
                size="md"
                variant="outline"
                rightIcon={<ExternalLink className="h-4 w-4" />}
              >
                Talent Profile
              </Button>
            </Link>
          )}
          {user.companyProfile && (
            <Link href={`/admin/companies/${user.companyProfile.id}`}>
              <Button
                size="md"
                variant="outline"
                rightIcon={<ExternalLink className="h-4 w-4" />}
              >
                Company Profile
              </Button>
            </Link>
          )}
          <Button
            size="md"
            variant="destructive"
            onClick={onDeleteClick}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
