"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Building2, Eye } from "lucide-react";
import { Alert, Badge, UniversalSearch, Pagination, Select,Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { fetchAdminSubscriptions } from "@/lib/adminApi";
import type { AdminSubscription } from "@/types/admin";
import { PricingSettings } from "@/components/admin/PricingSettings";
import { getErrorMessage } from "@blih/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";


const PAGE_SIZE = 20;

function getDaysRemaining(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function AdminSubscriptionsContent() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminSubscriptions({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
      });
      setSubs(data.subscriptions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  return (
    <main className="w-full px-6 py-6 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
              Company Subscriptions
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
            Monitor all company subscription plans, statuses, and expiry dates.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <PricingSettings />

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name or email..."
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
            { value: "EXPIRED", label: "Expired" },
          ]}
        />
      </div>

      <AdminTable<AdminSubscription>
        loading={loading}
        data={subs}
        rowKey={(s) => s.id}
        emptyIcon={<Building2 className="h-6 w-6" />}
        emptyTitle="No subscriptions found"
        emptySubtext={
          searchQuery || statusFilter
            ? "Try adjusting your filters."
            : "No company subscriptions yet."
        }
        columns={[
          {
            key: "company",
            header: "Company",
            render: (s) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                  {s.companyProfile.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.companyProfile.logoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (
                      s.companyProfile.companyName ||
                      s.companyProfile.user.email
                    )
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">
                    {s.companyProfile.companyName || "Unknown Company"}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">
                    {s.companyProfile.user.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "plan",
            header: "Plan",
            width: "110px",
            render: (s) => <AdminStatusBadge type="subPlan" value={s.plan} />,
          },
          {
            key: "status",
            header: "Status",
            width: "90px",
            render: (s) => (
              <AdminStatusBadge type="subscription" value={s.status} />
            ),
          },
          {
            key: "amount",
            header: "Amount",
            width: "120px",
            render: (s) => (
              <span className="font-mono font-medium text-[#17131F]">
                {s.amount.toLocaleString()} {s.currency}
              </span>
            ),
          },
          {
            key: "expires",
            header: "Expires",
            width: "110px",
            render: (s) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(s.expiresAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "days",
            header: "Days Left",
            width: "90px",
            render: (s) => {
              const days = getDaysRemaining(s.expiresAt);
              return (
                <span
                  className={`text-xs font-mono font-medium ${days === 0 ? "text-[#D32F2F]" : days <= 7 ? "text-[#D97706]" : "text-[#2E8F79]"}`}
                >
                  {s.status === "EXPIRED" ? "Expired" : `${days}d`}
                </span>
              );
            },
          },
          {
            key: "actions",
            header: "",
            width: "80px",
            render: (s) => (
              <Link href={`/admin/subscriptions/${s.id}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Eye className="h-3.5 w-3.5" />}
                >
                  View
                </Button>
              </Link>
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
    </main>
  );
}

export default function AdminSubscriptionsPage() {
  usePageTitle("Subscriptions | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminSubscriptionsContent />
    </AuthGuard>
  );
}
