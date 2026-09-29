"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, ConfirmDialog, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  fetchAdminJobById,
  updateAdminJobStatus,
  deleteAdminJob,
} from "@/lib/adminApi";
import type { AdminJobDetail } from "@/types/admin";
import { getErrorMessage } from "@blih/api-client";

import { JobDetailHeader } from "@/components/admin/job-detail/JobDetailHeader";
import { JobDetailStats } from "@/components/admin/job-detail/JobDetailStats";
import { JobDescriptionCard } from "@/components/admin/job-detail/JobDescriptionCard";
import { JobApplicationsCard } from "@/components/admin/job-detail/JobApplicationsCard";
import { JobDetailSidebar } from "@/components/admin/job-detail/JobDetailSidebar";

function AdminJobDetailContent() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<AdminJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadJob = async () => {
    try {
      const data = await fetchAdminJobById(jobId);
      setJob(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [jobId]);

  async function handleCloseJob() {
    setActionLoading(true);
    setActionError(null);
    try {
      await updateAdminJobStatus(jobId, "CLOSED");
      setShowCloseDialog(false);
      await loadJob();
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to close job");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReopenJob() {
    setActionLoading(true);
    setActionError(null);
    try {
      await updateAdminJobStatus(jobId, "ACTIVE");
      setShowReopenDialog(false);
      await loadJob();
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to reopen job");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteJob() {
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteAdminJob(jobId);
      setShowDeleteDialog(false);
      router.push("/admin/jobs");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to delete job");
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading job details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Job listing not found."}</Alert>
      </main>
    );
  }

  const applications = job.applications || [];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Hero Header */}
      <JobDetailHeader
        job={job}
        actionLoading={actionLoading}
        onCloseClick={() => setShowCloseDialog(true)}
        onReopenClick={() => setShowReopenDialog(true)}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />

      {/* 4 Metric Cards */}
      <JobDetailStats job={job} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Description & Candidate Applications */}
        <div className="lg:col-span-8 space-y-6">
          <JobDescriptionCard job={job} />
          <JobApplicationsCard applications={applications} />
        </div>

        {/* Right Column (4 cols): Hiring Organization & Danger Zone */}
        <div className="lg:col-span-4">
          <JobDetailSidebar
            job={job}
            onDeleteClick={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      {/* Force Close Dialog */}
      <ConfirmDialog
        isOpen={showCloseDialog}
        title="Force Close Job"
        message={`Are you sure you want to close "${job.title}"? It will no longer accept new candidate applications.`}
        confirmText="Close Job"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleCloseJob}
        onClose={() => setShowCloseDialog(false)}
        isLoading={actionLoading}
      />

      {/* Reopen Dialog */}
      <ConfirmDialog
        isOpen={showReopenDialog}
        title="Reopen Job Listing"
        message={`Reopen "${job.title}"? It will become active with a refreshed application window and accept new candidates.`}
        confirmText="Reopen Job"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleReopenJob}
        onClose={() => setShowReopenDialog(false)}
        isLoading={actionLoading}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Job Listing"
        message={`Are you sure you want to permanently delete "${job.title}"? This action cannot be undone and will erase all associated applications.`}
        confirmText="Yes, Delete Job"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteJob}
        onClose={() => setShowDeleteDialog(false)}
        isLoading={actionLoading}
      />
    </main>
  );
}

export default function AdminJobDetailPage() {
  usePageTitle("Job Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminJobDetailContent />
    </AuthGuard>
  );
}
