"use client";

import React from "react";
import { CreditCard, Tag, Calendar, Clock } from "lucide-react";

interface SubscriptionDetailStatsProps {
  subscription: any;
}

export function SubscriptionDetailStats({
  subscription,
}: SubscriptionDetailStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Membership Plan
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Tag className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {subscription.plan}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Active tier license
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Billed Rate
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {subscription.amount} {subscription.currency}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Periodic renewal charge
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Started On
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {new Date(subscription.startDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Subscription start
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Renews / Expires
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {subscription.expiresAt
              ? new Date(subscription.expiresAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Never"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Term end date
          </div>
        </div>
      </div>
    </div>
  );
}
