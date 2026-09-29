"use client";

import React from "react";
import { CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface SubscriptionPlanCardProps {
  subscription: any;
}

export function SubscriptionPlanCard({
  subscription,
}: SubscriptionPlanCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Subscription Terms & Configuration
            </h2>
            <p className="text-xs text-[#6E6678]">
              Licensing specifications, automated renewal, and term timeline
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="divide-y divide-[#F4EFF7] text-xs">
          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Plan Level</span>
            <span className="font-semibold text-sm text-[#17131F]">
              {subscription.plan}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Membership Status</span>
            <AdminStatusBadge type="subscription" value={subscription.status} />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Recurring Charge</span>
            <span className="font-medium text-[#17131F]">
              {subscription.amount} {subscription.currency}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Auto-Renewal</span>
            <span className="font-medium">
              {subscription.autoRenew ? (
                <span className="text-[#2E8F79] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                </span>
              ) : (
                <span className="text-[#6E6678] flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Disabled
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Term Window</span>
            <span className="font-mono text-[#17131F]">
              {new Date(subscription.startDate).toLocaleDateString()} –{" "}
              {subscription.expiresAt
                ? new Date(subscription.expiresAt).toLocaleDateString()
                : "Continuous"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
