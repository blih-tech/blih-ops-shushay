"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Globe,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Building2,
  User,
  ExternalLink,
} from "lucide-react";
import { Button } from "@blih/ui";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

interface CompanyDetailHeaderProps {
  company: any;
  onDeleteClick: () => void;
}

export function CompanyDetailHeader({
  company,
  onDeleteClick,
}: CompanyDetailHeaderProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  function copyEmail() {
    if (!company.user?.email) return;
    navigator.clipboard.writeText(company.user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  const sub = company.companySubscription;
  const location = [company.city, company.country].filter(Boolean).join(", ");
  const websiteUrl = company.website
    ? company.website.startsWith("http")
      ? company.website
      : `https://${company.website}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0 overflow-hidden">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoUrl}
                alt={company.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              company.companyName?.charAt(0).toUpperCase() || "C"
            )}
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                  {company.companyName}
                </h1>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border bg-[#2E8F79]/10 text-[#2E8F79] border-[#2E8F79]/30">
                  <Building2 className="h-3 w-3" />
                  Company
                </span>

                {sub ? (
                  <AdminStatusBadge type="subscription" value={sub.status} />
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    No Subscription
                  </span>
                )}

                {company.user && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      company.user.emailVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {company.user.emailVerified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Unverified
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6E6678]">
              {company.user?.email && (
                <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-mono">
                  <Mail className="h-3.5 w-3.5 text-[#6E6678]" />
                  <a
                    href={`mailto:${company.user.email}`}
                    className="hover:text-[#1E5BFF] transition-colors"
                  >
                    {company.user.email}
                  </a>
                  <button
                    onClick={copyEmail}
                    className="text-[#9E95A8] hover:text-[#17131F] transition-colors ml-1 p-0.5"
                    title="Copy email"
                  >
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-[#2E8F79]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              )}

              {location && (
                <div className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                  <MapPin className="h-3.5 w-3.5 text-[#6E6678]" />
                  <span>{location}</span>
                </div>
              )}

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#EEF3FF] border border-[#1E5BFF]/15 text-[#1E5BFF] rounded-lg px-2.5 py-1 hover:underline transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {company.user?.id && (
            <Link href={`/admin/users/${company.user.id}`}>
              <Button
                size="md"
                variant="outline"
                leftIcon={<User className="h-4 w-4" />}
              >
                User Account
              </Button>
            </Link>
          )}
          <Button
            size="md"
            variant="destructive"
            onClick={onDeleteClick}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
