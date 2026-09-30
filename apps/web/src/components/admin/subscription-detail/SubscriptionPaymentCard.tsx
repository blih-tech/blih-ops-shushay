"use client";

import React, { useState } from "react";
import { Receipt, Hash, Copy, Check } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminSubscriptionDetail } from "@/types/admin";

interface SubscriptionPaymentCardProps {
  payment: AdminSubscriptionDetail["payment"];
}

export function SubscriptionPaymentCard({
  payment,
}: SubscriptionPaymentCardProps) {
  const [copiedRef, setCopiedRef] = useState(false);

  function copyRef() {
    if (!payment?.txRef) return;
    navigator.clipboard.writeText(payment.txRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  }

  if (!payment) {
    return (
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs p-6 text-center text-xs text-[#6E6678] italic">
        No linked payment transaction recorded for this subscription.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Receipt className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Linked Payment Transaction
            </h2>
            <p className="text-xs text-[#6E6678]">
              Automated invoice clearance and billing transaction
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="divide-y divide-[#F4EFF7] text-xs">
          {payment.txRef && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
              <span className="text-[#6E6678] font-medium">
                Transaction Reference
              </span>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F8FC] border border-[#EBE5F0] font-mono text-[#17131F]">
                <Hash className="h-3.5 w-3.5 text-[#6E6678]" />
                <span>{payment.txRef}</span>
                <button
                  onClick={copyRef}
                  className="p-0.5 hover:text-[#1E5BFF] transition-colors"
                  title="Copy Reference"
                >
                  {copiedRef ? (
                    <Check className="h-3.5 w-3.5 text-[#2E8F79]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#6E6678]" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Payment Status</span>
            <AdminStatusBadge type="payment" value={payment.status} />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Amount Processed</span>
            <span className="font-semibold text-sm text-[#17131F]">
              {payment.amount} {payment.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
