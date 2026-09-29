"use client";

import React, { useState } from "react";
import { Receipt, Hash, Copy, Check, ShieldCheck } from "lucide-react";

interface PaymentReceiptCardProps {
  payment: any;
}

export function PaymentReceiptCard({ payment }: PaymentReceiptCardProps) {
  const [copiedRef, setCopiedRef] = useState(false);

  function copyRef() {
    if (!payment.txRef) return;
    navigator.clipboard.writeText(payment.txRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  }

  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Receipt className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Transaction Receipt & Gateway Reference
            </h2>
            <p className="text-xs text-[#6E6678]">
              Confirmed payment clearing and settlement details
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="divide-y divide-[#F4EFF7] text-xs">
          {payment.txRef && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
              <span className="text-[#6E6678] font-medium">
                Gateway Transaction Reference
              </span>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F8FC] border border-[#EBE5F0] font-mono text-[#17131F]">
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
            <span className="text-[#6E6678] font-medium">Billed Amount</span>
            <span className="font-semibold text-sm text-[#17131F]">
              {payment.amount} {payment.currency}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Payment Purpose</span>
            <span className="font-medium text-[#17131F]">
              {formatType(payment.paymentType)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Settlement Status</span>
            <span className="font-semibold text-[#17131F]">
              {payment.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-[#6E6678] font-medium">Processed At</span>
            <span className="font-mono text-[#17131F]">
              {new Date(payment.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] flex items-start gap-2.5 text-xs text-[#4A4453]">
          <ShieldCheck className="h-4 w-4 text-[#2E8F79] shrink-0 mt-0.5" />
          <span>
            This transaction was processed securely via the Chapa payment gateway. Digital receipts are automatically archived for compliance and platform accounting.
          </span>
        </div>
      </div>
    </div>
  );
}
