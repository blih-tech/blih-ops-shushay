"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Calendar, Hash, User, Copy, Check } from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface PaymentDetailHeaderProps {
  payment: any;
}

export function PaymentDetailHeader({ payment }: PaymentDetailHeaderProps) {
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
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0">
            <CreditCard className="h-8 w-8 text-[#1E5BFF]" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                {payment.amount}{" "}
                <span className="text-xl font-semibold text-[#6E6678]">
                  {payment.currency}
                </span>
              </h1>
              <AdminStatusBadge type="payment" value={payment.status} />
              <AdminStatusBadge
                type="paymentType"
                value={payment.paymentType}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
              {payment.txRef && (
                <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-mono">
                  <Hash className="h-3.5 w-3.5 text-[#6E6678]" />
                  <span>{payment.txRef}</span>
                  <button
                    onClick={copyRef}
                    className="text-[#9E95A8] hover:text-[#17131F] transition-colors ml-1 p-0.5"
                    title="Copy Transaction Reference"
                  >
                    {copiedRef ? (
                      <Check className="h-3 w-3 text-[#2E8F79]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              )}

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-[#6E6678]" />
                {new Date(payment.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F9F8FC] border border-[#EBE5F0] font-medium text-[#17131F]">
                {formatType(payment.paymentType)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {payment.user?.id && (
            <Link href={`/admin/users/${payment.user.id}`}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<User className="h-3.5 w-3.5" />}
              >
                Payer Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
