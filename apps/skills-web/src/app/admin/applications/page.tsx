"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Eye } from "lucide-react";
import { Alert, Badge, UniversalSearch, Pagination, Select } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminApplications } from "@/lib/adminApi";
import type { AdminApplication } from "@/types/admin";
import { Button } from "@blih/ui";

const PAGE_SIZE = 20;

function AdminApplicationsContent() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminApplications({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
      });
      setApplications(data.applications);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Applications" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
              Job Applications
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Monitor all job applications across the platform.
          </p>
        </div>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by applicant, job title, or company..."
          />
        </div>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 shrink-0"
          options={[
            { value: "", label: "All Statuses" },
            { value: "SUBMITTED", label: "Submitted" },
            { value: "IN_REVIEW", label: "In Review" },
            { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
            { value: "OFFER_EXTENDED", label: "Offer Extended" },
            { value: "REJECTED", label: "Rejected" },
            { value: "WITHDRAWN", label: "Withdrawn" },
          ]}
        />
      </div>

      <AdminTable<AdminApplication>
        loading={loading}
        data={applications}
        rowKey={(a) => a.id}
        emptyIcon={<FileText className="h-6 w-6" />}
        emptyTitle="No applications found"
        emptySubtext={searchQuery || statusFilter ? "Try adjusting your filters." : "No applications submitted yet."}
        columns={[
          {
            key: "applicant",
            header: "Applicant",
            render: (a) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                  {a.talentProfile.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.talentProfile.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (a.talentProfile.fullName || a.talentProfile.user.email).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">
                    {a.talentProfile.fullName || a.talentProfile.user.email}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">{a.talentProfile.user.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "job",
            header: "Job",
            render: (a) => (
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#17131F] truncate max-w-[200px]">{a.job.title}</p>
                <p className="text-xs text-[#6E6678] truncate">
                  {a.job.companyProfile.companyName || "Unknown Company"}
                </p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            width: "150px",
            render: (a) => <AdminStatusBadge type="application" value={a.status} />,
          },
          {
            key: "jobStatus",
            header: "Job Status",
            width: "90px",
            render: (a) => <AdminStatusBadge type="job" value={a.job.status} size="sm" />,
          },
          {
            key: "applied",
            header: "Applied",
            width: "100px",
            render: (a) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            width: "80px",
            render: (a) => (
              <Link href={`/admin/applications/${a.id}`}>
                <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                  View
                </Button>
              </Link>
            ),
          },
        ]}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </main>
  );
}

export default function AdminApplicationsPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminApplicationsContent />
    </AuthGuard>
  );
}
