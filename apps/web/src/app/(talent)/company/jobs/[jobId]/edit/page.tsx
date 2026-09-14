"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, Skeleton, Card } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { getJobById, updateJob } from "@/lib/jobApi";
import { Job } from "@/types/job";
import { JobForm, JobFormData } from "@/components/jobs/JobForm";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function CompanyEditJobContent({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      setInitLoading(true);
      setError(null);
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (err: any) {
        console.error("Error loading job:", err);
        setError(err?.message || "Failed to load job details.");
      } finally {
        setInitLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  const handleSubmit = async (formData: JobFormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateJob(jobId, formData);
      router.push(`/company/jobs/${jobId}`);
    } catch (err: any) {
      console.error("Error updating job:", err);
      setError(err?.message || "Failed to update job post.");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton
          variant="rectangular"
          width={180}
          height={20}
          className="rounded-md"
        />
        <Card className="p-8 space-y-6">
          <Skeleton
            variant="rectangular"
            width={280}
            height={28}
            className="rounded-md"
          />
          <Skeleton
            variant="rectangular"
            height={140}
            className="w-full rounded-xl"
          />
        </Card>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Job Postings
        </Link>
        <Alert variant="error" title="Opportunity Unavailable">
          {error}
        </Alert>
      </main>
    );
  }

  if (job?.status === "CLOSED") {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Job Postings
        </Link>
        <Alert variant="warning" title="Closed Job Listing">
          This job post is closed and cannot be modified. Create a new posting
          to reopen the role.
        </Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <Link
        href={`/company/jobs/${jobId}`}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunity Details
      </Link>

      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
          Edit Opportunity Listing
        </h1>
        <p className="text-sm sm:text-base text-[#6E6678] font-sans">
          Update role details, required competencies, or compensation
          specifications.
        </p>
      </div>

      {job && (
        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loadingLabel="Saving Changes..."
          isSubmitting={loading}
          error={error}
        />
      )}
    </main>
  );
}

export default function CompanyEditJobPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyEditJobContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
