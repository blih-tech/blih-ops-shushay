"use client";

import React from "react";
import { CreditCard, ShieldCheck, Tag, Calendar } from "lucide-react";

interface PaymentDetailStatsProps {
  payment: any;
}

export function PaymentDetailStats({ payment }: PaymentDetailStatsProps) {
  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Gross Amount
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {payment.amount} {payment.currency}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Settlement total
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Transaction Status
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {payment.status}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Gateway verification
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Classification
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <Tag className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {formatType(payment.paymentType)}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Payment category
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Timestamp
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {new Date(payment.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Execution record
          </div>
        </div>
      </div>
    </div>
  );
}
