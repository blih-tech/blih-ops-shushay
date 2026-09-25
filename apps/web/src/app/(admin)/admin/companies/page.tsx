"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Building2, Eye, Trash2 } from "lucide-react";
import {
  Alert,
  Badge,
  UniversalSearch,
  Pagination,
  Select,
  ConfirmDialog,
  Button,
} from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { fetchAdminCompanies, deleteAdminUser } from "@/lib/adminApi";
import type { AdminCompanyItem } from "@/types/admin";
import { getErrorMessage } from "@blih/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

const PAGE_SIZE = 25;

function getDaysRemaining(expiresAt: string | null | undefined) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function AdminCompaniesContent() {
  const [companies, setCompanies] = useState<AdminCompanyItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subFilter, setSubFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminCompanyItem | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminCompanies({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        subscriptionStatus: subFilter || undefined,
      });
      setCompanies(data.companies);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load company records");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, subFilter]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, subFilter]);

  async function handleDelete() {
    if (!deleteTarget?.user?.id) return;
    setActionLoading(deleteTarget.id);
    setActionError(null);
    try {
      await deleteAdminUser(deleteTarget.user.id);
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to delete company account");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="w-full px-6 py-6 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
              Company Management
            </h1>
            <Badge variant="primary">{total} REGISTERED</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
            Monitor hiring organizations, subscription status, and contact
            details.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name, email, or country..."
          />
        </div>
        <Select
          id="sub-filter"
          value={subFilter}
          onChange={(e) => setSubFilter(e.target.value)}
          className="w-full sm:w-56 shrink-0"
          options={[
            { value: "", label: "All Subscriptions" },
            { value: "ACTIVE", label: "Active" },
            { value: "EXPIRED", label: "Expired" },
          ]}
        />
      </div>

      <AdminTable<AdminCompanyItem>
        loading={loading}
        data={companies}
        rowKey={(c) => c.id}
        emptyIcon={<Building2 className="h-6 w-6" />}
        emptyTitle="No companies found"
        emptySubtext={
          searchQuery || subFilter
            ? "Try adjusting your filters."
            : "No hiring organizations registered yet."
        }
        columns={[
          {
            key: "company",
            header: "Company",
            render: (c) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-2xs">
                  {c.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.logoUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-xl aspect-square"
                    />
                  ) : (
                    (c.companyName || c.user.email).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">
                    {c.companyName || "Unnamed Company"}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">
                    {c.user.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "location",
            header: "Location",
            width: "140px",
            render: (c) => (
              <span className="text-xs text-[#6E6678]">
                {[c.city, c.country].filter(Boolean).join(", ") || "—"}
              </span>
            ),
          },
          {
            key: "jobs",
            header: "Jobs",
            width: "60px",
            render: (c) => (
              <span className="font-mono text-sm font-medium text-[#17131F]">
                {c._count.jobs}
              </span>
            ),
          },
          {
            key: "subscription",
            header: "Subscription",
            width: "130px",
            render: (c) =>
              c.companySubscription ? (
                <div className="flex items-center gap-1.5">
                  <AdminStatusBadge
                    type="subscription"
                    value={c.companySubscription.status}
                    size="sm"
                  />
                  <span className="text-xs font-mono text-[#6E6678]">
                    {c.companySubscription.plan.charAt(0) +
                      c.companySubscription.plan.slice(1).toLowerCase()}
                  </span>
                </div>
              ) : (
                <Badge variant="secondary" size="sm">
                  None
                </Badge>
              ),
          },
          {
            key: "expires",
            header: "Expires",
            width: "120px",
            render: (c) => {
              if (!c.companySubscription)
                return <span className="text-[#6E6678] text-xs">—</span>;
              const days = getDaysRemaining(c.companySubscription.expiresAt);
              return (
                <div>
                  <p className="text-xs font-mono text-[#6E6678]">
                    {new Date(
                      c.companySubscription.expiresAt,
                    ).toLocaleDateString()}
                  </p>
                  {days !== null && (
                    <p
                      className={`text-xs font-mono font-medium ${days === 0 ? "text-[#D32F2F]" : days <= 7 ? "text-[#D97706]" : "text-[#2E8F79]"}`}
                    >
                      {days === 0 ? "Expired" : `${days}d left`}
                    </p>
                  )}
                </div>
              );
            },
          },
          {
            key: "joined",
            header: "Joined",
            width: "100px",
            render: (c) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            width: "140px",
            render: (c) => (
              <div className="flex items-center gap-1.5">
                <Link href={`/admin/companies/${c.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                  >
                    View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828]"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setDeleteTarget(c)}
                  isLoading={actionLoading === c.id}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Company Account"
        message={`Are you sure you want to permanently delete company "${deleteTarget?.companyName || deleteTarget?.user?.email}"? This will remove their user account, job postings, and company profile. This action cannot be undone.`}
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
}

export default function AdminCompaniesPage() {
  usePageTitle("Companies | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCompaniesContent />
    </AuthGuard>
  );
}
