"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  User,
  Briefcase,
  Calendar,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Alert, Badge, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminApplicationById } from "@/lib/adminApi";

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
      } catch (err: any) {
        setError(err.message || "Failed to load application details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appId]);

  if (loading) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[{ label: "Applications", href: "/admin/applications" }, { label: "Loading..." }]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[{ label: "Applications", href: "/admin/applications" }, { label: "Error" }]}
        />
        <Alert variant="error">{error || "Application not found"}</Alert>
      </main>
    );
  }

  const applicantName = application.talentProfile?.fullName || "Unknown Applicant";
  const jobTitle = application.job?.title || "Unknown Job";
  const companyName = application.job?.companyProfile?.companyName || "Unknown Company";

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Applications", href: "/admin/applications" },
          { label: `${applicantName} → ${jobTitle}` },
        ]}
      />

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-xl shrink-0 overflow-hidden">
                {application.talentProfile?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={application.talentProfile.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  applicantName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {applicantName}
                  </h1>
                  <AdminStatusBadge type="application" value={application.status} />
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-2 flex-wrap">
                  <Briefcase className="h-3.5 w-3.5" />
                  Applied for <span className="font-medium text-[#17131F]">{jobTitle}</span> at{" "}
                  <span className="font-medium text-[#17131F]">{companyName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Integrated Stat Strip */}
          <div className="mt-6 pt-6 border-t border-[#EBE5F0] grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Application Status</p>
              <div className="mt-1">
                <AdminStatusBadge type="application" value={application.status} />
              </div>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Applied Date</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Job Employment Type</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {application.job?.employmentType ? application.job.employmentType.replace(/_/g, " ") : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Cover Letter */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-base text-[#17131F]">Cover Letter</h2>
            <div className="bg-[#F9F8FC] rounded-2xl p-5 border border-[#EBE5F0]">
              <p className="text-sm text-[#17131F] leading-relaxed whitespace-pre-line">
                {application.coverLetter || "No cover letter provided."}
              </p>
            </div>
          </div>

          {/* Applicant & Job Links */}
          <div className="pt-8 space-y-4">
            <h2 className="font-display font-bold text-base text-[#17131F]">Linked Entities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="bg-[#F9F8FC] rounded-2xl p-4 border border-[#EBE5F0] space-y-2">
                <p className="font-mono text-xs text-[#6E6678] uppercase">Applicant Profile</p>
                <p className="font-medium text-[#17131F] text-base">{applicantName}</p>
                <p className="text-xs text-[#6E6678]">{application.talentProfile?.user?.email}</p>
                {application.talentProfile?.id && (
                  <div className="pt-2">
                    <Link href={`/admin/talents/${application.talentProfile.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Talent Profile →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="bg-[#F9F8FC] rounded-2xl p-4 border border-[#EBE5F0] space-y-2">
                <p className="font-mono text-xs text-[#6E6678] uppercase">Job Listing</p>
                <p className="font-medium text-[#17131F] text-base">{jobTitle}</p>
                <p className="text-xs text-[#6E6678]">{companyName}</p>
                {application.job?.id && (
                  <div className="pt-2">
                    <Link href={`/admin/jobs/${application.job.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Job Details →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resume Link */}
          {application.talentProfile?.cvUrl && (
            <div className="pt-8 space-y-3">
              <h2 className="font-display font-bold text-base text-[#17131F]">Applicant Resume / CV</h2>
              <a
                href={application.talentProfile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#1E5BFF] hover:underline font-medium text-xs bg-[#EEF3FF] px-3 py-1.5 rounded-xl border border-[#1E5BFF]/15"
              >
                <FileText className="h-4 w-4" /> Download Resume Document
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
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminApplicationDetailContent />
    </AuthGuard>
  );
}
