"use client";

import React from "react";
import { Briefcase, CreditCard, ShieldCheck, Calendar } from "lucide-react";

interface CompanyDetailStatsProps {
  company: any;
}

export function CompanyDetailStats({ company }: CompanyDetailStatsProps) {
  const sub = company.companySubscription;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Job Postings
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {company.jobs?.length ?? 0}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Total posted openings
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Subscription Plan
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {sub?.plan || "Free Tier"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            {sub ? `${sub.amount ?? 0} ${sub.currency || "USD"}` : "Standard access"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Billing Status
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {sub?.status || (company.subscriptionActive ? "ACTIVE" : "INACTIVE")}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Account membership
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Renews / Expires
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {sub?.expiresAt
              ? new Date(sub.expiresAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Ongoing"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Subscription duration
          </div>
        </div>
      </div>
    </div>
  );
}
