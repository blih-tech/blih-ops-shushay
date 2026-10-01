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
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface CompanyDetailSidebarProps {
  company: any;
  onDeleteClick: () => void;
}

export function CompanyDetailSidebar({
  company,
  onDeleteClick,
}: CompanyDetailSidebarProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmail() {
    if (!company.user?.email) return;
    navigator.clipboard.writeText(company.user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  const sub = company.companySubscription;

  return (
    <div className="space-y-6">
      {/* Subscription Breakdown Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#7B2CBF]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Subscription Plan
            </h2>
          </div>
          {sub ? (
            <AdminStatusBadge type="subscription" value={sub.status} />
          ) : (
            <span className="text-xs text-[#6E6678]">Free</span>
          )}
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          {sub ? (
            <>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#6E6678]">Plan Tier</span>
                <span className="font-semibold text-sm text-[#17131F]">
                  {sub.plan}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
                <span className="text-[#6E6678]">Billing Rate</span>
                <span className="font-medium text-[#17131F]">
                  {sub.amount ?? 0} {sub.currency || "USD"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
                <span className="text-[#6E6678]">Expiration Date</span>
                <span className="font-medium text-[#17131F]">
                  {sub.expiresAt
                    ? new Date(sub.expiresAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No expiration"}
                </span>
              </div>
              {sub.id && (
                <div className="pt-2 border-t border-[#F4EFF7]">
                  <Link href={`/admin/subscriptions/${sub.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-between text-xs"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Subscription Invoices & Details
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-[#6E6678] italic">
              No active premium membership assigned to this company.
            </p>
          )}
        </div>
      </div>

      {/* Account Info (NO ID DISPLAYED) */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD]">
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Account Security & Status
          </h2>
        </div>
        <div className="p-5 space-y-3.5 text-xs">
          {company.user?.email && (
            <div>
              <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
                Primary Account Email
              </div>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#F9F8FC] border border-[#EBE5F0] font-mono break-all text-[#17131F]">
                <span>{company.user.email}</span>
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

          {company.user && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center justify-between">
              <span className="text-[#6E6678]">Email Verification</span>
              <span className="font-medium text-[#17131F]">
                {company.user.emailVerified ? (
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

          {company.user?.createdAt && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center justify-between">
              <span className="text-[#6E6678]">Registered On</span>
              <span className="font-medium text-[#17131F]">
                {new Date(company.user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {company.user?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/users/${company.user.id}`}>
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

      {/* Danger Zone */}
      <div className="bg-red-50/40 rounded-2xl border border-red-200/80 p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <h2 className="font-display font-bold text-sm">Danger Zone</h2>
        </div>
        <p className="text-xs text-red-600/90 leading-relaxed">
          Deleting this company account will permanently remove all associated jobs, candidate applications, and subscription access.
        </p>
        <Button
          size="md"
          variant="destructive"
          className="w-full justify-center"
          onClick={onDeleteClick}
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Delete Company Account
        </Button>
      </div>
    </div>
  );
}
