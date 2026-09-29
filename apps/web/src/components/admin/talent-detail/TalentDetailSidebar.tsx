"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Copy,
  Check,
  User,
  Award,
} from "lucide-react";
import { Button } from "@blih/ui";

interface TalentDetailSidebarProps {
  talent: any;
  onDeleteClick: () => void;
}

export function TalentDetailSidebar({
  talent,
  onDeleteClick,
}: TalentDetailSidebarProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmail() {
    if (!talent.user?.email) return;
    navigator.clipboard.writeText(talent.user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  const skills: string[] = talent.skills || [];

  return (
    <div className="space-y-6">
      {/* Account Info (NO ID DISPLAYED) */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD]">
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Candidate Information
          </h2>
        </div>
        <div className="p-5 space-y-3.5 text-xs">
          {talent.user?.email && (
            <div>
              <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
                Primary Email
              </div>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#F9F8FC] border border-[#EBE5F0] font-mono break-all text-[#17131F]">
                <span>{talent.user.email}</span>
                <button
                  onClick={copyEmail}
                  className="p-1 hover:text-[#1E5BFF] transition-colors shrink-0"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="h-3.5 w-3.5 text-[#2E8F79]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#6E6678]" />
                  )}
                </button>
              </div>
            </div>
          )}

          {talent.user && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center justify-between">
              <span className="text-[#6E6678]">Email Verification</span>
              <span className="font-medium text-[#17131F]">
                {talent.user.emailVerified ? (
                  <span className="text-[#2E8F79] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Unverified
                  </span>
                )}
              </span>
            </div>
          )}

          {talent.user?.createdAt && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center justify-between">
              <span className="text-[#6E6678]">Profile Registered</span>
              <span className="font-medium text-[#17131F]">
                {new Date(talent.user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {talent.user?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/users/${talent.user.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center text-xs"
                  leftIcon={<User className="h-3.5 w-3.5" />}
                >
                  Manage User Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Skills Card */}
      {skills.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
            <h2 className="font-display font-bold text-sm text-[#17131F] flex items-center gap-2">
              <Award className="h-4 w-4 text-[#6E6678]" /> Skills Listed
            </h2>
            <span className="text-xs font-semibold text-[#6E6678]">
              {skills.length}
            </span>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F0EEF8] text-[#5A506B] border border-[#E2DCED]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-red-50/40 rounded-2xl border border-red-200/80 p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <h2 className="font-display font-bold text-sm">Danger Zone</h2>
        </div>
        <p className="text-xs text-red-600/90 leading-relaxed">
          Deleting this talent account will permanently purge their profile, resume attachments, application submissions, and course history.
        </p>
        <Button
          size="sm"
          variant="destructive"
          className="w-full justify-center"
          onClick={onDeleteClick}
          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
        >
          Delete Talent Account
        </Button>
      </div>
    </div>
  );
}
