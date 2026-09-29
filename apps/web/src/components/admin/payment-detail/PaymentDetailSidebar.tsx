"use client";

import React from "react";
import Link from "next/link";
import { User, Mail, Shield, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@blih/ui";

interface PaymentDetailSidebarProps {
  payment: any;
}

export function PaymentDetailSidebar({ payment }: PaymentDetailSidebarProps) {
  const user = payment.user;
  const userDisplayName =
    user?.talentProfile?.fullName ||
    user?.companyProfile?.companyName ||
    user?.email ||
    "Payer User";

  return (
    <div className="space-y-6">
      {/* Payer Account Details Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#1E5BFF]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Payer Account
            </h2>
          </div>
          {user?.role && (
            <span className="text-xs font-semibold text-[#6E6678] bg-[#F4EFF7] px-2 py-0.5 rounded-md uppercase">
              {user.role}
            </span>
          )}
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Account Holder
            </div>
            <div className="font-semibold text-sm text-[#17131F]">
              {userDisplayName}
            </div>
          </div>

          {user?.email && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <Mail className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span className="truncate font-mono">{user.email}</span>
            </div>
          )}

          {user?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/users/${user.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between text-xs"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Manage User Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Gateway & Clearing Info */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#2E8F79]" />
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Gateway Clearing
          </h2>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#6E6678]">Payment Processor</span>
            <span className="font-medium text-[#17131F]">Chapa Gateway</span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Settlement Currency</span>
            <span className="font-medium text-[#17131F]">
              {payment.currency}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Security Protocol</span>
            <span className="font-medium text-[#2E8F79] flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> 3D Secure Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
