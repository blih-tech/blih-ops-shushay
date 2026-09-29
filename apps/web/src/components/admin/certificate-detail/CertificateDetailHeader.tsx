"use client";

import React from "react";
import { Award, Calendar, Download, User, CheckCircle2 } from "lucide-react";
import { Badge, Button } from "@blih/ui";

interface CertificateDetailHeaderProps {
  cert: any;
}

export function CertificateDetailHeader({ cert }: CertificateDetailHeaderProps) {
  const recipientName =
    cert.user?.talentProfile?.fullName ||
    cert.user?.email ||
    "Candidate Recipient";
  const courseTitle = cert.course?.title || "Course Certificate";

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0">
            <Award className="h-8 w-8 text-[#1E5BFF]" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                {courseTitle}
              </h1>
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                VERIFIED CREDENTIAL
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-medium text-[#17131F]">
                <User className="h-3.5 w-3.5 text-[#6E6678]" />
                Issued to {recipientName}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-[#6E6678]" />
                Conferred on{" "}
                {new Date(cert.createdAt || cert.issueDate).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {cert.pdfUrl && (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download PDF
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
