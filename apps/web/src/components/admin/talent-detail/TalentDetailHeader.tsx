"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  User,
  GraduationCap,
} from "lucide-react";
import { Button } from "@blih/ui";

interface TalentDetailHeaderProps {
  talent: any;
  onDeleteClick: () => void;
}

export function TalentDetailHeader({
  talent,
  onDeleteClick,
}: TalentDetailHeaderProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmail() {
    if (!talent.user?.email) return;
    navigator.clipboard.writeText(talent.user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  const location = [talent.city, talent.country].filter(Boolean).join(", ");

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0 overflow-hidden">
            {talent.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={talent.photoUrl}
                alt={talent.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              talent.fullName?.charAt(0).toUpperCase() || "T"
            )}
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                  {talent.fullName}
                </h1>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border bg-[#1E5BFF]/10 text-[#1E5BFF] border-[#1E5BFF]/30">
                  <User className="h-3 w-3" />
                  Talent
                </span>

                {talent.user && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      talent.user.emailVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {talent.user.emailVerified ? (
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
                )}
              </div>

              {talent.title && (
                <p className="text-sm font-medium text-[#6E6678] mt-0.5">
                  {talent.title}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6E6678]">
              {talent.user?.email && (
                <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-mono">
                  <Mail className="h-3.5 w-3.5 text-[#6E6678]" />
                  <a
                    href={`mailto:${talent.user.email}`}
                    className="hover:text-[#1E5BFF] transition-colors"
                  >
                    {talent.user.email}
                  </a>
                  <button
                    onClick={copyEmail}
                    className="text-[#9E95A8] hover:text-[#17131F] transition-colors ml-1 p-0.5"
                    title="Copy email"
                  >
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-[#2E8F79]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              )}

              {location && (
                <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                  <MapPin className="h-3.5 w-3.5 text-[#6E6678]" />
                  <span>{location}</span>
                </div>
              )}

              {talent.englishLevel && (
                <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                  <GraduationCap className="h-3.5 w-3.5 text-[#6E6678]" />
                  <span>English: {talent.englishLevel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {talent.user?.id && (
            <Link href={`/admin/users/${talent.user.id}`}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<User className="h-3.5 w-3.5" />}
              >
                User Account
              </Button>
            </Link>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={onDeleteClick}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
