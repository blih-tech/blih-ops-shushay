"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CreditCard, TrendingUp, DollarSign, AlertCircle, Eye } from "lucide-react";
import { Alert, Badge, UniversalSearch, Pagination, Select, Card, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminPayments } from "@/lib/adminApi";
import type { AdminPayment } from "@/types/admin";

const PAGE_SIZE = 20;

function AdminPaymentsContent() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [summary, setSummary] = useState({ totalRevenue: 0, successfulCount: 0 });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPayments({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        paymentType: typeFilter || undefined,
      });
      setPayments(data.payments);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, typeFilter]);

  const displayName = (p: AdminPayment) =>
    p.user.talentProfile?.fullName ||
    p.user.companyProfile?.companyName ||
    p.user.email.split("@")[0];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Payments" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
              Payment Transactions
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Monitor all Chapa payment transactions across the platform.
          </p>
        </div>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-[#D9CEDF] bg-white p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#6E6678] uppercase">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-[#17131F]">
            {summary.totalRevenue.toLocaleString()} ETB
          </p>
          <p className="text-xs text-[#6E6678]">{summary.successfulCount} successful</p>
        </Card>

        <Card className="rounded-2xl border border-[#D9CEDF] bg-white p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#6E6678] uppercase">All Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-[#17131F]">{total}</p>
          <p className="text-xs text-[#6E6678]">Across all payment types</p>
        </Card>

        <Card className="rounded-2xl border border-[#D9CEDF] bg-white p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#6E6678] uppercase">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF9EE] text-[#D97706] flex items-center justify-center">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-[#17131F]">
            {payments.filter((p) => p.status === "PENDING").length}
          </p>
          <p className="text-xs text-[#6E6678]">On current page</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email or transaction reference..."
          />
        </div>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 shrink-0"
          options={[
            { value: "", label: "All Statuses" },
            { value: "PENDING", label: "Pending" },
            { value: "SUCCESSFUL", label: "Successful" },
            { value: "FAILED", label: "Failed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
        />
        <Select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-52 shrink-0"
          options={[
            { value: "", label: "All Types" },
            { value: "SKILLS_ACCESS", label: "Skills Access" },
            { value: "COMPANY_SUBSCRIPTION", label: "Subscription" },
          ]}
        />
      </div>

      <AdminTable<AdminPayment>
        loading={loading}
        data={payments}
        rowKey={(p) => p.id}
        emptyIcon={<DollarSign className="h-6 w-6" />}
        emptyTitle="No payments found"
        emptySubtext={searchQuery || statusFilter || typeFilter ? "Try adjusting your filters." : "No payment transactions recorded yet."}
        columns={[
          {
            key: "user",
            header: "User",
            render: (p) => (
              <div className="min-w-0">
                <p className="font-medium text-[#17131F] truncate">{displayName(p)}</p>
                <p className="text-xs text-[#6E6678] truncate">{p.user.email}</p>
              </div>
            ),
          },
          {
            key: "txRef",
            header: "Tx Reference",
            render: (p) => (
              <span className="font-mono text-xs text-[#6E6678] truncate max-w-[180px] block" title={p.txRef}>
                {p.txRef}
              </span>
            ),
          },
          {
            key: "type",
            header: "Type",
            width: "150px",
            render: (p) => <AdminStatusBadge type="paymentType" value={p.paymentType} />,
          },
          {
            key: "amount",
            header: "Amount",
            width: "110px",
            render: (p) => (
              <span className="font-mono font-medium text-[#17131F]">
                {p.amount.toLocaleString()} {p.currency}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            width: "120px",
            render: (p) => <AdminStatusBadge type="payment" value={p.status} />,
          },
          {
            key: "date",
            header: "Date",
            width: "110px",
            render: (p) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            width: "80px",
            render: (p) => (
              <Link href={`/admin/payments/${p.id}`}>
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

export default function AdminPaymentsPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminPaymentsContent />
    </AuthGuard>
  );
}
