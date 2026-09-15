"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Clock,
  Globe,
  Users,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  Skeleton,
  Alert,
  EmptyState,
  ConfirmDialog,
} from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { getJobById, closeJob, getJobApplications } from "@/lib/jobApi";
import { formatSalary } from "@/lib/jobOptions";
import { CandidateApplicationCard } from "@/components/company/CandidateApplicationCard";
import { Job } from "@/types/job";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function CompanyJobDetailContent({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [jobData, appsData] = await Promise.all([
          getJobById(jobId),
          getJobApplications(jobId).catch(() => []),
        ]);
        setJob(jobData);
        setApplications(appsData || []);
      } catch (err: any) {
        console.error("Error loading job details:", err);
        setError(err?.message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId]);

  const handleConfirmClose = async () => {
    setClosing(true);
    setActionError(null);
    try {
      const updated = await closeJob(jobId);
      setJob(updated);
      setConfirmOpen(false);
    } catch (err: any) {
      setActionError(err?.message || "Failed to close job posting.");
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Skeleton
          variant="rectangular"
          width={200}
          height={20}
          className="rounded-md"
        />
        <Card className="p-8 space-y-4">
          <Skeleton
            variant="rectangular"
            width={300}
            height={32}
            className="rounded-md"
          />
          <Skeleton variant="text" className="w-full" />
        </Card>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Job Postings
        </Link>
        <Alert variant="error" title={error || "Job Not Found"}>
          Unable to display position details. The job may not exist or network
          connection failed.
        </Alert>
      </main>
    );
  }

  const isClosed = job.status === "CLOSED";
  const isExpired =
    !isClosed &&
    Boolean(
      job.applicationDeadline &&
        new Date(job.applicationDeadline) < new Date()
    );

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/company/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to My Job Postings
      </Link>

      {actionError && (
        <Alert variant="error" title="Could Not Close Role">
          {actionError}
        </Alert>
      )}

      {/* Header Card */}
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                {job.title}
              </h1>
              <Badge
                variant={
                  isClosed ? "outline" : isExpired ? "amber" : "verified"
                }
              >
                {isClosed ? "Closed" : isExpired ? "Expired" : "Active"}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#6E6678] flex-wrap pt-1">
              <span className="font-semibold text-[#1E5BFF]">
                {job.employmentType.replace("_", " ")}
              </span>
              <span>·</span>
              <span>{job.experienceLevel} Level</span>
              {job.englishLevel && (
                <>
                  <span>·</span>
                  <span>{job.englishLevel} English</span>
                </>
              )}
              <span>·</span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-[#2E8F79]" />
                {formatSalary(job)}
              </span>
              {job.timezone && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-[#1E5BFF]" />
                    {job.timezone}
                  </span>
                </>
              )}
              {job.workingHours && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#1E5BFF]" />
                    {job.workingHours}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {!isClosed && (
              <>
                <Link href={`/company/jobs/${job.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3.5 text-xs font-semibold rounded-xl border-[#D9CEDF] text-[#17131F] hover:bg-[#F8FAFD] hover:border-[#1E5BFF]/40 transition-all"
                    leftIcon={<Edit className="h-3.5 w-3.5" />}
                  >
                    Edit Role
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={closing}
                  onClick={() => {
                    setActionError(null);
                    setConfirmOpen(true);
                  }}
                  className="h-9 px-3.5 text-xs font-semibold rounded-xl border-red-200/80 bg-red-50/50 text-red-600 hover:bg-red-100/80 hover:border-red-300 transition-all"
                >
                  {closing ? "Closing..." : "Close Role"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Required Competencies Line */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-[#D9CEDF]/60 text-xs font-mono text-[#6E6678]">
            <Sparkles className="w-4 h-4 text-[#1E5BFF] shrink-0" />
            <span>
              <span className="text-[#17131F] font-semibold">
                Required Competencies:{" "}
              </span>
              {job.requiredSkills.join(" · ")}
            </span>
          </div>
        )}
      </div>

      {/* Overview & Description */}
      <Card className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 bg-white space-y-4">
        <h2 className="font-display text-xl font-bold text-[#17131F]">
          Job Description
        </h2>
        <div className="text-sm text-[#6E6678] leading-relaxed font-sans whitespace-pre-line">
          {job.description}
        </div>
      </Card>

      {/* Applicants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1E5BFF]" />
            <h2 className="font-display text-xl font-bold text-[#17131F]">
              Candidate Applications ({applications.length})
            </h2>
          </div>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8 text-[#1E5BFF]" />}
            title="No Applications Received"
            description="No candidates have submitted applications for this role yet."
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <CandidateApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          if (!closing) {
            setConfirmOpen(false);
            setActionError(null);
          }
        }}
        onConfirm={handleConfirmClose}
        title="Close Job Post"
        message="Are you sure you want to close this job post? Once closed, this role will no longer accept new applications or allow edits."
        confirmText="Yes, Close Role"
        cancelText="Keep Active"
        variant="destructive"
        isLoading={closing}
      />
    </main>
  );
}

export default function CompanyJobDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyJobDetailContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
