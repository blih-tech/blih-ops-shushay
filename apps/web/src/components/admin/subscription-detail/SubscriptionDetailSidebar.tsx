"use client";

import React from "react";
import Link from "next/link";
import { Building2, Mail, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@blih/ui";

interface SubscriptionDetailSidebarProps {
  subscription: any;
}

export function SubscriptionDetailSidebar({
  subscription,
}: SubscriptionDetailSidebarProps) {
  const cp = subscription.companyProfile;
  const companyName = cp?.companyName || "Subscribed Organization";
  const location = [cp?.city, cp?.country].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      {/* Subscriber Organization Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#2E8F79]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Subscriber Organization
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Company Name
            </div>
            <div className="font-semibold text-sm text-[#17131F]">
              {companyName}
            </div>
          </div>

          {cp?.user?.email && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <Mail className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span className="truncate font-mono">{cp.user.email}</span>
            </div>
          )}

          {location && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <MapPin className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {cp?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/companies/${cp.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between text-xs"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Manage Company Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Lifecycle Summary */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#7B2CBF]" />
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Lifecycle & Billing Status
          </h2>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#6E6678]">Billing Model</span>
            <span className="font-medium text-[#17131F]">
              {subscription.autoRenew ? "Automatic Recurring" : "Fixed Term"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Created On</span>
            <span className="font-medium text-[#17131F]">
              {new Date(subscription.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">License Status</span>
            <span className="font-semibold text-[#17131F]">
              {subscription.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
