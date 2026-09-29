"use client";

import React from "react";
import { Hash, Calendar, ShieldCheck, FileText } from "lucide-react";

interface CertificateDetailStatsProps {
  cert: any;
}

export function CertificateDetailStats({ cert }: CertificateDetailStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Credential Code
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Hash className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-lg font-mono font-bold text-[#17131F] truncate">
            {cert.certificateNumber || "VERIFIED"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Public verification token
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Issue Date
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {new Date(cert.createdAt || cert.issueDate).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Conferred timestamp
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Validity
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            Active
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Authenticated record
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            PDF Document
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {cert.pdfUrl ? "Generated" : "Pending"}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            Printable certificate
          </div>
        </div>
      </div>
    </div>
  );
}
