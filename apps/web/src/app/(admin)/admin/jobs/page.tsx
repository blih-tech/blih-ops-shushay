"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Briefcase, Eye, XCircle, RefreshCw } from "lucide-react";
import {
  Button,
  Alert,
  ConfirmDialog,
  UniversalSearch,
  Pagination,
  Select,
  Badge,
} from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminJobs, updateAdminJobStatus } from "@/lib/adminApi";
import type { AdminJob } from "@/types/admin";

const PAGE_SIZE = 20;

function AdminJobsContent() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [closeTarget, setCloseTarget] = useState<AdminJob | null>(null);
  const [reopenTarget, setReopenTarget] = useState<AdminJob | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminJobs({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        employmentType: employmentTypeFilter || undefined,
      });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, employmentTypeFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, employmentTypeFilter]);

  async function handleCloseJob() {
    if (!closeTarget) return;
    setActionLoading(closeTarget.id);
    setActionError(null);
    try {
      await updateAdminJobStatus(closeTarget.id, "CLOSED");
      setCloseTarget(null);
      load();
    } catch (err: any) {
      setActionError(err.message || "Failed to close job");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReopenJob() {
    if (!reopenTarget) return;
    setActionLoading(reopenTarget.id);
    setActionError(null);
    try {
      await updateAdminJobStatus(reopenTarget.id, "ACTIVE");
      setReopenTarget(null);
      load();
    } catch (err: any) {
      setActionError(err.message || "Failed to reopen job");
    } finally {
      setActionLoading(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formatEmploymentType = (t: string) =>
    t.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Jobs" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
              Job Management
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Monitor all job postings, manage statuses, and view applications.
          </p>
        </div>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {actionError && <Alert variant="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, or description..."
          />
        </div>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 shrink-0"
          options={[
            { value: "", label: "All Statuses" },
            { value: "ACTIVE", label: "Active" },
            { value: "CLOSED", label: "Closed" },
          ]}
        />
        <Select
          id="employment-filter"
          value={employmentTypeFilter}
          onChange={(e) => setEmploymentTypeFilter(e.target.value)}
          className="w-full sm:w-44 shrink-0"
          options={[
            { value: "", label: "All Types" },
            { value: "FULL_TIME", label: "Full Time" },
            { value: "PART_TIME", label: "Part Time" },
            { value: "CONTRACT", label: "Contract" },
            { value: "FREELANCE", label: "Freelance" },
            { value: "INTERNSHIP", label: "Internship" },
          ]}
        />
      </div>

      <AdminTable<AdminJob>
        loading={loading}
        data={jobs}
        rowKey={(j) => j.id}
        emptyIcon={<Briefcase className="h-6 w-6" />}
        emptyTitle="No jobs found"
        emptySubtext={searchQuery || statusFilter ? "Try adjusting your filters." : "No jobs posted yet."}
        columns={[
          {
            key: "title",
            header: "Job",
            render: (j) => (
              <div className="min-w-0">
                <p className="font-medium text-[#17131F] truncate max-w-xs">{j.title}</p>
                <p className="text-xs text-[#6E6678] truncate">
                  {j.companyProfile.companyName || "Unknown Company"}
                </p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            width: "100px",
            render: (j) => <AdminStatusBadge type="job" value={j.status} />,
          },
          {
            key: "type",
            header: "Type",
            width: "130px",
            render: (j) => (
              <span className="text-xs text-[#6E6678]">{formatEmploymentType(j.employmentType)}</span>
            ),
          },
          {
            key: "level",
            header: "Level",
            width: "110px",
            render: (j) => (
              <span className="text-xs text-[#6E6678]">
                {j.experienceLevel.replace(/_/g, " ")}
              </span>
            ),
          },
          {
            key: "applications",
            header: "Apps",
            width: "70px",
            render: (j) => (
              <span className="font-mono text-sm text-[#17131F] font-medium">
                {j._count.applications}
              </span>
            ),
          },
          {
            key: "deadline",
            header: "Deadline",
            width: "110px",
            render: (j) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {j.applicationDeadline
                  ? new Date(j.applicationDeadline).toLocaleDateString()
                  : "—"}
              </span>
            ),
          },
          {
            key: "created",
            header: "Posted",
            width: "100px",
            render: (j) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(j.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            width: "160px",
            render: (j) => (
              <div className="flex items-center gap-1.5">
                <Link href={`/admin/jobs/${j.id}`}>
                  <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                    View
                  </Button>
                </Link>
                {j.status === "ACTIVE" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828]"
                    leftIcon={<XCircle className="h-3.5 w-3.5" />}
                    onClick={() => setCloseTarget(j)}
                    isLoading={actionLoading === j.id}
                  >
                    Close
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    onClick={() => setReopenTarget(j)}
                    isLoading={actionLoading === j.id}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!closeTarget}
        title="Force Close Job"
        message={`Are you sure you want to close "${closeTarget?.title}"? It will no longer accept new applications.`}
        confirmText="Close Job"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleCloseJob}
        onClose={() => setCloseTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!reopenTarget}
        title="Reopen Job"
        message={`Reopen "${reopenTarget?.title}"? It will become active and accept new applications.`}
        confirmText="Reopen Job"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleReopenJob}
        onClose={() => setReopenTarget(null)}
      />
    </main>
  );
}

export default function AdminJobsPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminJobsContent />
    </AuthGuard>
  );
}
