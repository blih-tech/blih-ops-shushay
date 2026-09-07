"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { createJob } from "@/lib/jobApi";
import { ApiError } from "@/lib/api";
import { JobForm, JobFormData } from "@/components/jobs/JobForm";

export default function CompanyNewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  const handleSubmit = async (formData: JobFormData) => {
    setLoading(true);
    setError(null);
    setSubscriptionRequired(false);

    try {
      await createJob(formData);
      router.push("/company/jobs");
    } catch (err: any) {
      console.error("Error creating job:", err);
      if (err instanceof ApiError && err.status === 402) {
        setSubscriptionRequired(true);
        setError(
          "Creating and publishing active jobs requires an active company subscription.",
        );
      } else {
        setError(err?.message || "Failed to create job posting.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Job Postings
        </Link>

        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
            Publish New Opportunity
          </h1>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Post an evidence-matched job opening to reach evaluated candidates
            with verified skills and course certifications.
          </p>
        </div>

        <JobForm
          onSubmit={handleSubmit}
          submitLabel="Publish Job Post"
          loadingLabel="Publishing Role..."
          isSubmitting={loading}
          error={error}
          subscriptionRequired={subscriptionRequired}
        />
      </main>
    </AuthGuard>
  );
}
