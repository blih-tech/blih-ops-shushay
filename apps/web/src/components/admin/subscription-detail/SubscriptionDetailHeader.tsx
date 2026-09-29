"use client";

import React from "react";
import Link from "next/link";
import { Building2, Calendar, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface SubscriptionDetailHeaderProps {
  subscription: any;
}

export function SubscriptionDetailHeader({
  subscription,
}: SubscriptionDetailHeaderProps) {
  const cp = subscription.companyProfile;
  const companyName = cp?.companyName || "Organization";

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0 overflow-hidden">
            {cp?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cp.logoUrl}
                alt={companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              companyName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                {companyName}
              </h1>
              <AdminStatusBadge
                type="subscription"
                value={subscription.status}
              />
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase bg-[#7B2CBF]/10 text-[#7B2CBF] border border-[#7B2CBF]/30">
                {subscription.plan} Plan
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-medium text-[#17131F]">
                <CreditCard className="h-3.5 w-3.5 text-[#6E6678]" />
                {subscription.amount} {subscription.currency}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-[#6E6678]" />
                {subscription.expiresAt
                  ? `Expires ${new Date(subscription.expiresAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : "No Expiration Date"}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Building2 className="h-3.5 w-3.5 text-[#6E6678]" />
                Enterprise Membership
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {cp?.id && (
            <Link href={`/admin/companies/${cp.id}`}>
              <Button
                size="sm"
                variant="outline"
                rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
              >
                Company Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
