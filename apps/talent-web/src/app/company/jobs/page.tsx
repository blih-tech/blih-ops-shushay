"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { Button, Badge, Card, Skeleton, Alert, EmptyState } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useCompanyJobs } from "@/hooks/useCompanyJobs";
import { CompanyJobCard } from "@/components/company/CompanyJobCard";

function CompanyJobsContent() {
  const { jobs, loading, error, closeJob } = useCompanyJobs();
  const [closingId, setClosingId] = useState<string | null>(null);

  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to close this job post? Closed jobs cannot accept new applications or be edited.")) {
      return;
    }
    setClosingId(jobId);
    try {
      await closeJob(jobId);
    } catch (err: any) {
      alert(err?.message || "Failed to close job");
    } finally {
      setClosingId(null);
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status === "ACTIVE").length;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Job Postings & Roles
            </h1>
            <Badge variant="primary">{activeJobsCount} ACTIVE</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Publish positions, specify verified skill criteria, and review candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/company/jobs/new" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create New Job Post
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Error Loading Jobs">
          {error}
        </Alert>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="border border-[#D9CEDF] rounded-3xl p-6 bg-white space-y-4">
              <Skeleton variant="rectangular" width={220} height={24} className="rounded-md" />
              <Skeleton variant="text" className="w-3/4" />
              <div className="flex gap-4">
                <Skeleton variant="rectangular" width={100} height={16} className="rounded-md" />
                <Skeleton variant="rectangular" width={80} height={16} className="rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8 text-[#1E5BFF]" />}
          title="No Job Listings Yet"
          description="Create your first job listing to start receiving applications from verified candidates."
          action={
            <Link href="/company/jobs/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Create First Job
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <CompanyJobCard
              key={job.id}
              job={job}
              closingId={closingId}
              onCloseJob={handleCloseJob}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function CompanyJobsPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyJobsContent />
    </AuthGuard>
  );
}
