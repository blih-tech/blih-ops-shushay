"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Building2, Globe, Phone, Eye } from "lucide-react";
import { Alert, Badge, Card, UniversalSearch, Pagination, Select } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminCompanies } from "@/lib/adminApi";
import { formatPhone } from "@/lib/formatPhone";
import type { AdminCompanyItem } from "@/types/admin";
import { Button } from "@blih/ui";

const PAGE_SIZE = 20;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subFilter, setSubFilter] = useState("");
  const [selected, setSelected] = useState<AdminCompanyItem | null>(null);

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
    } catch (err: any) {
      setError(err.message || "Failed to load company records");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, subFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, subFilter]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Companies" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Company Management
            </h1>
            <Badge variant="primary">{total} REGISTERED</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Monitor hiring organizations, subscription status, and contact details.
          </p>
        </div>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

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
          className="w-full sm:w-52 shrink-0"
          options={[
            { value: "", label: "All Subscriptions" },
            { value: "ACTIVE", label: "Active Subscription" },
            { value: "EXPIRED", label: "Expired Subscription" },
          ]}
        />
      </div>

      <AdminTable<AdminCompanyItem>
        loading={loading}
        data={companies}
        rowKey={(c) => c.id}
        emptyIcon={<Building2 className="h-6 w-6" />}
        emptyTitle="No companies found"
        emptySubtext={searchQuery || subFilter ? "Try adjusting your filters." : "No hiring organizations registered yet."}
        columns={[
          {
            key: "company",
            header: "Company",
            render: (c) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                  {c.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (c.companyName || c.user.email).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">{c.companyName || "Unnamed Company"}</p>
                  <p className="text-xs text-[#6E6678] truncate">{c.user.email}</p>
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
              <span className="font-mono text-sm font-medium text-[#17131F]">{c._count.jobs}</span>
            ),
          },
          {
            key: "subscription",
            header: "Subscription",
            width: "130px",
            render: (c) =>
              c.companySubscription ? (
                <div className="flex items-center gap-1.5">
                  <AdminStatusBadge type="subscription" value={c.companySubscription.status} size="sm" />
                  <span className="text-xs font-mono text-[#6E6678]">
                    {c.companySubscription.plan.charAt(0) + c.companySubscription.plan.slice(1).toLowerCase()}
                  </span>
                </div>
              ) : (
                <Badge variant="secondary" size="sm">None</Badge>
              ),
          },
          {
            key: "expires",
            header: "Expires",
            width: "120px",
            render: (c) => {
              if (!c.companySubscription) return <span className="text-[#6E6678] text-xs">—</span>;
              const days = getDaysRemaining(c.companySubscription.expiresAt);
              return (
                <div>
                  <p className="text-xs font-mono text-[#6E6678]">
                    {new Date(c.companySubscription.expiresAt).toLocaleDateString()}
                  </p>
                  {days !== null && (
                    <p className={`text-xs font-mono font-medium ${days === 0 ? "text-[#D32F2F]" : days <= 7 ? "text-[#D97706]" : "text-[#2E8F79]"}`}>
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
            header: "",
            width: "80px",
            render: (c) => (
              <Link href={`/admin/companies/${c.id}`}>
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

export default function AdminCompaniesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCompaniesContent />
    </AuthGuard>
  );
}
