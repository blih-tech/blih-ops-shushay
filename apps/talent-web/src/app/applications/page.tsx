"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  DollarSign,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Button, Badge, Card, Skeleton, Alert, EmptyState } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { getTalentApplications } from "@/lib/jobApi";

function formatSalary(job: any): string {
  if (!job) return "Competitive";
  if (job.salaryDisplay) return job.salaryDisplay;
  if (job.salaryMin && job.salaryMax) {
    return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.salaryCurrency || "USD"}`;
  }
  if (job.salaryMin) {
    return `From $${job.salaryMin.toLocaleString()} ${job.salaryCurrency || "USD"}`;
  }
  return "Competitive";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "IN_REVIEW":
      return <Badge variant="secondary">In Review</Badge>;
    case "INTERVIEW_SCHEDULED":
      return <Badge variant="verified">Interview Scheduled</Badge>;
    case "OFFER_EXTENDED":
      return <Badge variant="verified">Offer Extended</Badge>;
    case "REJECTED":
      return <Badge variant="outline">Declined</Badge>;
    case "SUBMITTED":
    default:
      return <Badge variant="primary">Applied</Badge>;
  }
}

function ApplicationsContent() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTalentApplications();
        setApplications(data || []);
      } catch (err: any) {
        console.error("Error loading applications:", err);
        setError(err?.message || "Failed to load submitted applications.");
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton
          variant="rectangular"
          width={220}
          height={32}
          className="rounded-md"
        />
        <div className="space-y-4 pt-4">
          <Card className="p-6 space-y-3">
            <Skeleton
              variant="rectangular"
              width={280}
              height={24}
              className="rounded-md"
            />
            <Skeleton variant="text" className="w-1/2" />
          </Card>
          <Card className="p-6 space-y-3">
            <Skeleton
              variant="rectangular"
              width={280}
              height={24}
              className="rounded-md"
            />
            <Skeleton variant="text" className="w-1/2" />
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              My Applications
            </h1>
            <Badge variant="primary">{applications.length} SUBMITTED</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Track the real-time status of your opportunity submissions.
          </p>
        </div>

        <Link href="/jobs">
          <Button
            size="sm"
            variant="outline"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Explore More Roles
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="error" title="Error Loading Applications">
          {error}
        </Alert>
      )}

      {/* Applications List or Empty State */}
      {!error && applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-10 h-10 text-[#1E5BFF]" />}
          title="No Applications Submitted Yet"
          description="Explore active developer and technical roles and apply with your verified candidate profile."
          action={
            <Link href="/jobs">
              <Button variant="primary" size="md">
                Browse Jobs
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.job || {};
            const company = job.companyProfile || {};
            const companyId = company.id || job.companyProfileId;
            const companyName = company.companyName || "Verified Partner";
            const location =
              [company.city, company.country].filter(Boolean).join(", ") ||
              "Remote";
            const appliedDate = new Date(app.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            return (
              <Card
                key={app.id}
                className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 bg-white hover:border-[#1E5BFF]/50 transition-all shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-display text-xl font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors"
                      >
                        {job.title || "Job Opportunity"}
                      </Link>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-[#6E6678] flex-wrap">
                      {companyId ? (
                        <Link
                          href={`/companies/${companyId}`}
                          className="flex items-center gap-1 text-[#1E5BFF] hover:underline font-semibold"
                        >
                          <Building2 className="h-3.5 w-3.5" />
                          {companyName}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-[#1E5BFF]" />
                          {companyName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
                        {location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-[#2E8F79]" />
                        {formatSalary(job)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    {job.id && (
                      <Link href={`/jobs/${job.id}`}>
                        <Button
                          size="sm"
                          variant="primary"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          View Job Details
                        </Button>
                      </Link>
                    )}
                    {companyId && (
                      <Link href={`/companies/${companyId}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={
                            <Building2 className="w-3.5 h-3.5 text-[#1E5BFF]" />
                          }
                        >
                          View Hiring Org
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {app.coverLetter && (
                  <p className="text-xs text-[#6E6678] bg-[#F8FAFD] border border-[#E6EAF3] p-3 rounded-xl font-sans italic">
                    "{app.coverLetter}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[#D9CEDF]/60 text-xs font-mono text-[#6E6678]">
                  <span>Applied on {appliedDate}</span>
                  <span className="text-[#1E5BFF] font-semibold">
                    Profile & CV Submitted
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function ApplicationsPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ApplicationsContent />
    </AuthGuard>
  );
}
