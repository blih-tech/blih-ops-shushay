"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Button, Badge, Card, Skeleton, Alert } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { getJobById } from "@/lib/jobApi";
import { Job } from "@/types/job";
import { JobApplyModal } from "@/components/jobs/JobApplyModal";
import { getErrorMessage } from "@blih/api-client";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function formatSalary(job: Job): string {
  if (job.salaryDisplay) return job.salaryDisplay;
  if (job.salaryMin && job.salaryMax) {
    return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.salaryCurrency}`;
  }
  if (job.salaryMin) {
    return `From $${job.salaryMin.toLocaleString()} ${job.salaryCurrency}`;
  }
  return "Competitive";
}

function JobDetailsContent({ jobId }: { jobId: string }) {
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (err: unknown) {
        console.error("Error loading job:", err);
        setError(getErrorMessage(err) || "Job not found or could not be loaded");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  if (loading) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Skeleton
          variant="rectangular"
          width={180}
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
          <Skeleton variant="text" className="w-3/4" />
          <div className="flex gap-4 pt-4">
            <Skeleton
              variant="rectangular"
              width={120}
              height={20}
              className="rounded-md"
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={20}
              className="rounded-md"
            />
          </div>
        </Card>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities Feed
        </Link>
        <Alert variant="error" title={error || "Position Not Found"}>
          This job listing may have been closed or removed by the hiring
          company.
        </Alert>
      </main>
    );
  }

  const companyName = job.companyProfile?.companyName || "Verified Partner";
  const location = job.companyProfile?.city
    ? `${job.companyProfile.city}, ${job.companyProfile.country || ""}`
    : job.timezone || "Remote";
  const isTalent = user?.role === "TALENT";
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
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities Feed
      </Link>

      {/* Job Header Card */}
      <div className="bg-white border border-[#D9CEDF] rounded-xl p-6 sm:p-10 shadow-sm space-y-6">
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
              <Badge variant="primary">
                {job.employmentType.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#6E6678] flex-wrap pt-1">
              {job.companyProfileId ? (
                <Link
                  href={`/companies/${job.companyProfileId}`}
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {job.companyProfileId && (
              <Link href={`/companies/${job.companyProfileId}`}>
                <Button size="md" variant="outline">
                  View Hiring Organization
                </Button>
              </Link>
            )}

            {isTalent &&
              (job.hasApplied ? (
                <Button
                  size="lg"
                  variant="outline"
                  disabled
                  className="bg-[#E6F5F0] text-[#2E8F79] border-[#2E8F79]/30 font-semibold cursor-default"
                  leftIcon={<CheckCircle2 className="w-5 h-5 text-[#2E8F79]" />}
                >
                  Applied
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="primary"
                  disabled={isClosed || isExpired}
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  {isClosed
                    ? "Job Closed"
                    : isExpired
                    ? "Deadline Passed"
                    : "Apply with Evidence Profile"}
                </Button>
              ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D9CEDF]/60">
          <span className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium">
            {job.experienceLevel} Level
          </span>
          {job.englishLevel && (
            <span className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium">
              English: {job.englishLevel}
            </span>
          )}
          {job.workingHours && (
            <span className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> {job.workingHours}
            </span>
          )}
          {job.timezone && (
            <span className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium flex items-center gap-1">
              <Globe className="w-3 h-3" /> {job.timezone}
            </span>
          )}
        </div>
      </div>

      {/* Job Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <Card className="border border-[#D9CEDF] rounded-xl p-6 sm:p-8 space-y-4 bg-white">
            <h2 className="font-display text-xl font-bold text-[#17131F]">
              Role Overview
            </h2>
            <div className="text-sm text-[#6E6678] leading-relaxed font-sans whitespace-pre-line">
              {job.description}
            </div>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="border border-[#D9CEDF] rounded-xl p-6 space-y-4 bg-white">
            <h3 className="font-display text-lg font-bold text-[#17131F]">
              Required Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/20 text-xs font-mono text-[#1E5BFF] font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>

            {job.applicationDeadline && (
              <div className="pt-4 border-t border-[#D9CEDF]/60 text-xs font-mono text-[#6E6678]">
                <span className="block text-[#17131F] font-semibold mb-1">
                  Application Deadline:
                </span>
                {new Date(job.applicationDeadline).toLocaleDateString()}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <JobApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        onSuccess={() =>
          setJob((prev) => (prev ? { ...prev, hasApplied: true } : null))
        }
      />
    </main>
  );
}

export default function JobDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT", "COMPANY", "ADMIN"]}>
      <JobDetailsContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
