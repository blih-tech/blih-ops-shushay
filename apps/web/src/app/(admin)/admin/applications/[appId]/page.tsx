"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, Briefcase, ExternalLink } from "lucide-react";
import { Alert, Button, MetricCard } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { fetchAdminApplicationById } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

function AdminApplicationDetailContent() {
  const params = useParams();
  const appId = params.appId as string;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminApplicationById(appId);
        setApplication(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "Failed to load application details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appId]);

  if (loading) {
    return (
      <main className="w-full px-6 py-6 space-y-6">

        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="w-full px-6 py-6 space-y-4">

        <Alert variant="error">{error || "Application not found"}</Alert>
      </main>
    );
  }

  const applicantName =
    application.talentProfile?.fullName || "Unknown Applicant";
  const jobTitle = application.job?.title || "Unknown Job";
  const companyName =
    application.job?.companyProfile?.companyName || "Unknown Company";
  const employmentType = application.job?.employmentType
    ? application.job.employmentType.replace(/_/g, " ")
    : "—";

  return (
    <main className="w-full px-6 py-6 space-y-4">


      {/* Stat Grid */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          value={application.status.replace(/_/g, " ")}
          label="Status"
          variant="primary"
        />
        <MetricCard
          value={new Date(application.createdAt).toLocaleDateString()}
          label="Applied Date"
          variant="surface"
        />
        <MetricCard
          value={employmentType}
          label="Employment Type"
          variant="surface"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-xl shrink-0 overflow-hidden">
              {application.talentProfile?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={application.talentProfile.photoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                applicantName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                  {applicantName}
                </h1>
                <AdminStatusBadge
                  type="application"
                  value={application.status}
                />
              </div>
              {/* Inline data chip */}
              <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                <Briefcase className="h-3 w-3 shrink-0" />
                Applied for{" "}
                <span className="font-medium text-[#17131F] ml-1">
                  {jobTitle}
                </span>
                <span className="text-[#D9CEDF]">·</span>
                {companyName}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="divide-y divide-[#EBE5F0]">
          {/* Cover Letter */}
          <div className="p-6 sm:p-8 space-y-3">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
              Cover Letter
            </h2>
            <div className="bg-[#F9F8FC] rounded-2xl p-5 border border-[#EBE5F0]">
              <p className="text-sm text-[#17131F] leading-relaxed whitespace-pre-line">
                {application.coverLetter || "No cover letter provided."}
              </p>
            </div>
          </div>

          {/* Linked Entities */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
              Linked Entities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Applicant */}
              <div className="flex items-center gap-3 p-4 bg-[#F9F8FC] rounded-2xl border border-[#EBE5F0]">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-sm shrink-0">
                  {applicantName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs text-[#6E6678]">Applicant</p>
                  <p className="font-medium text-[#17131F] text-sm truncate">
                    {applicantName}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">
                    {application.talentProfile?.user?.email}
                  </p>
                </div>
                {application.talentProfile?.id && (
                  <Link href={`/admin/talents/${application.talentProfile.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs shrink-0"
                    >
                      View →
                    </Button>
                  </Link>
                )}
              </div>

              {/* Job */}
              <div className="flex items-center gap-3 p-4 bg-[#F9F8FC] rounded-2xl border border-[#EBE5F0]">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs text-[#6E6678]">Job Listing</p>
                  <p className="font-medium text-[#17131F] text-sm truncate">
                    {jobTitle}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">
                    {companyName}
                  </p>
                </div>
                {application.job?.id && (
                  <Link href={`/admin/jobs/${application.job.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs shrink-0"
                    >
                      View →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Resume */}
          {application.talentProfile?.cvUrl && (
            <div className="p-6 sm:p-8 space-y-3">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                Resume / CV
              </h2>
              <a
                href={application.talentProfile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#1E5BFF] font-medium text-xs bg-[#EEF3FF] hover:bg-[#DDE7FF] px-3 py-2 rounded-xl border border-[#1E5BFF]/15 transition-colors"
              >
                <FileText className="h-4 w-4" /> Download Resume
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AdminApplicationDetailPage() {
  usePageTitle("Application Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminApplicationDetailContent />
    </AuthGuard>
  );
}
