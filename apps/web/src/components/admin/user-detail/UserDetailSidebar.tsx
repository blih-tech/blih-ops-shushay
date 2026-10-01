"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@blih/ui";
import type { AdminUserDetail } from "@/types/admin";

interface UserDetailSidebarProps {
  user: AdminUserDetail;
  enrollmentsCount: number;
  onDeleteClick: () => void;
}

export function UserDetailSidebar({
  user,
  enrollmentsCount,
  onDeleteClick,
}: UserDetailSidebarProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Account Identity & Verification Card (NO ID DISPLAYED) */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD]">
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Account Security & Status
          </h2>
        </div>
        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Primary Email
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#F9F8FC] border border-[#EBE5F0] font-mono break-all text-[#17131F]">
              <span>{user.email}</span>
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

          <div className="pt-2 border-t border-[#F4EFF7] flex items-center justify-between">
            <span className="text-[#6E6678]">Email Verification</span>
            <span className="font-medium text-[#17131F]">
              {user.emailVerified ? (
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

          <div className="pt-2 border-t border-[#F4EFF7] flex items-center justify-between">
            <span className="text-[#6E6678]">Registered On</span>
            <span className="font-medium text-[#17131F]">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Activity & Records Summary */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD]">
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Activity & Records
          </h2>
        </div>
        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#6E6678]">Certificates Earned</span>
            <span className="font-semibold text-sm text-[#17131F]">
              {user._count?.certificates ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Payment Transactions</span>
            <span className="font-semibold text-sm text-[#17131F]">
              {user._count?.paymentTransactions ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Enrolled Courses</span>
            <span className="font-semibold text-sm text-[#17131F]">
              {enrollmentsCount}
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
          Deleting this user is irreversible. All related talent profiles, applications, and curriculum progress will be permanently erased.
        </p>
        <Button
          size="md"
          variant="destructive"
          className="w-full justify-center"
          onClick={onDeleteClick}
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Delete User Account
        </Button>
      </div>
    </div>
  );
}
