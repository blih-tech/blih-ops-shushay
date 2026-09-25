"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, Calendar, MapPin, Users, Globe, Clock, XCircle, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { Alert, Badge, MetricCard, Button, ConfirmDialog } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { fetchAdminJobById, updateAdminJobStatus, deleteAdminJob } from "@/lib/adminApi";
import type { AdminJobDetail } from "@/types/admin";
import { getErrorMessage } from "@blih/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

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
      setError(getErrorMessage(err) || "Failed to load job");
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
      <main className="w-full px-6 py-6 space-y-6">

        <div className="h-64 bg-[#F4F1F8] border border-[#D9CEDF] rounded-xl animate-pulse" />
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="w-full px-6 py-6">

        <Alert variant="error" className="mt-6">
          {error || "Job not found"}
        </Alert>
      </main>
    );
  }

  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const salaryDisplay =
    job.salaryDisplay ||
    (job.salaryMin
      ? `${job.salaryCurrency} ${job.salaryMin}${job.salaryMax ? `–${job.salaryMax}` : "+"}`
      : "Not disclosed");

  return (
    <main className="w-full px-6 py-6 space-y-5">


      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          value={job.applications.length}
          label="Applications"
          variant="primary"
        />
        <MetricCard
          value={formatType(job.experienceLevel)}
          label="Experience"
          variant="surface"
        />
        <MetricCard
          value={
            job.applicationDeadline
              ? new Date(job.applicationDeadline).toLocaleDateString()
              : "None"
          }
          label="Deadline"
          variant="surface"
        />
        <MetricCard value={salaryDisplay} label="Salary" variant="surface" />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {job.title}
                  </h1>
                  <AdminStatusBadge type="job" value={job.status} />
                </div>
                {/* Inline data chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Building2 className="h-3 w-3 shrink-0" />
                    {job.companyProfile.companyName || "Unknown Company"}
                  </span>
                  {job.companyProfile.city && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {job.companyProfile.city}
                      {job.companyProfile.country
                        ? `, ${job.companyProfile.country}`
                        : ""}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    {formatType(job.employmentType)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job.status === "ACTIVE" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828]"
                    leftIcon={<XCircle className="h-3.5 w-3.5" />}
                    onClick={() => setShowCloseDialog(true)}
                    isLoading={actionLoading}
                  >
                    Close Job
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    onClick={() => setShowReopenDialog(true)}
                    isLoading={actionLoading}
                  >
                    Reopen Job
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setShowDeleteDialog(true)}
                  isLoading={actionLoading}
                >
                  Delete Job
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body — two column layout */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8 divide-y divide-[#EBE5F0]">
              {/* Description */}
              <div className="space-y-3">
                <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                  Job Description
                </h2>
                <p className="text-sm text-[#6E6678] whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Required Skills */}
              {job.requiredSkills.length > 0 && (
                <div className="pt-8 space-y-3">
                  <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              <div className="pt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Applications
                  </h2>
                  <Badge variant="primary">{job.applications.length}</Badge>
                </div>

                {job.applications.length === 0 ? (
                  <p className="text-sm text-[#6E6678]">No applications yet.</p>
                ) : (
                  <div className="divide-y divide-[#EBE5F0]">
                    {job.applications.map((app) => (
                      <div
                        key={app.id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden shadow-2xs">
                            {app.talentProfile.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={app.talentProfile.photoUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (
                                app.talentProfile.fullName ||
                                app.talentProfile.user.email
                              )
                                .charAt(0)
                                .toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-[#17131F] truncate">
                              {app.talentProfile.fullName ||
                                app.talentProfile.user.email}
                            </p>
                            <p className="text-xs text-[#6E6678] truncate">
                              {app.talentProfile.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <AdminStatusBadge
                            type="application"
                            value={app.status}
                            size="sm"
                          />
                          <span className="text-xs font-mono text-[#6E6678]">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="space-y-3">
                <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                  Company
                </h2>
                <div className="space-y-2 text-sm text-[#6E6678]">
                  <p className="font-medium text-[#17131F]">
                    {job.companyProfile.companyName || "Unknown"}
                  </p>
                  <p>{job.companyProfile.user.email}</p>
                  {job.companyProfile.country && (
                    <p className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {job.companyProfile.city
                        ? `${job.companyProfile.city}, `
                        : ""}
                      {job.companyProfile.country}
                    </p>
                  )}
                  {job.companyProfile.companySubscription && (
                    <div className="pt-2 border-t border-[#EBE5F0]">
                      <p className="text-xs font-mono text-[#6E6678] uppercase mb-1.5">
                        Subscription
                      </p>
                      <div className="flex items-center gap-2">
                        <AdminStatusBadge
                          type="subscription"
                          value={job.companyProfile.companySubscription.status}
                          size="sm"
                        />
                        <span className="text-xs text-[#6E6678]">
                          {job.companyProfile.companySubscription.plan}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6678] mt-1">
                        Expires:{" "}
                        {new Date(
                          job.companyProfile.companySubscription.expiresAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <Link href={`/admin/companies/${job.companyProfile.id}`}>
                  <span className="text-xs text-[#1E5BFF] hover:underline cursor-pointer">
                    View Company →
                  </span>
                </Link>
              </div>

              {/* Country Restrictions */}
              {job.countryRestrictions.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-[#EBE5F0]">
                  <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                    Country Restrictions
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {job.countryRestrictions.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-lg bg-[#F9F8FC] border border-[#D9CEDF] text-xs text-[#6E6678] font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCloseDialog}
        title="Force Close Job"
        message={`Are you sure you want to close "${job.title}"? It will no longer accept new applications.`}
        confirmText="Close Job"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleCloseJob}
        onClose={() => setShowCloseDialog(false)}
      />

      <ConfirmDialog
        isOpen={showReopenDialog}
        title="Reopen Job"
        message={`Reopen "${job.title}"? It will become active with a new 30-day application deadline and accept new candidates.`}
        confirmText="Reopen Job"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleReopenJob}
        onClose={() => setShowReopenDialog(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Job"
        message={`Are you sure you want to permanently delete "${job.title}"? This action cannot be undone and will delete all associated job applications.`}
        confirmText="Delete Job"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteJob}
        onClose={() => setShowDeleteDialog(false)}
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
