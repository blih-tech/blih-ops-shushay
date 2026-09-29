"use client";

import React from "react";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

interface CompanyOverviewCardProps {
  company: any;
}

export function CompanyOverviewCard({ company }: CompanyOverviewCardProps) {
  const location = [company.city, company.country].filter(Boolean).join(", ");

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Company Overview & Contact
            </h2>
            <p className="text-xs text-[#6E6678]">
              Organizational summary and designated contact details
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {company.description ? (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8] mb-1.5">
              About the Company
            </div>
            <p className="text-sm text-[#4A4453] leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#6E6678] italic">
            No company description provided.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#F4EFF7]">
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-[#6E6678] shrink-0" />
            <div>
              <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                Contact Email
              </div>
              <div className="text-xs font-medium text-[#17131F] truncate">
                {company.contactEmail || "Not provided"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-[#6E6678] shrink-0" />
            <div>
              <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                Contact Phone
              </div>
              <div className="text-xs font-medium text-[#17131F]">
                {company.contactPhone || "Not provided"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-[#6E6678] shrink-0" />
            <div>
              <div className="text-[11px] text-[#9E95A8] uppercase font-semibold">
                Headquarters
              </div>
              <div className="text-xs font-medium text-[#17131F]">
                {location || "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
