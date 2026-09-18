"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  DollarSign,
  Eye,
} from "lucide-react";
import {
  Alert,
  Badge,
  UniversalSearch,
  Pagination,
  Select,
  Button,
} from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

import { fetchAdminPayments } from "@/lib/adminApi";
import type { AdminPayment } from "@/types/admin";
import { getErrorMessage } from "@blih/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

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
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    successfulCount: 0,
  });
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
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, typeFilter]);

  const displayName = (p: AdminPayment) =>
    p.user.talentProfile?.fullName ||
    p.user.companyProfile?.companyName ||
    p.user.email.split("@")[0];

  return (
    <main className="w-full px-6 py-6 space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
              Payment Transactions
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
            Monitor all Chapa payment transactions across the platform.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}



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
          className="w-full sm:w-44 shrink-0"
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
        emptySubtext={
          searchQuery || statusFilter || typeFilter
            ? "Try adjusting your filters."
            : "No payment transactions recorded yet."
        }
        columns={[
          {
            key: "user",
            header: "User",
            render: (p) => (
              <div className="min-w-0">
                <p className="font-medium text-[#17131F] truncate">
                  {displayName(p)}
                </p>
                <p className="text-xs text-[#6E6678] truncate">
                  {p.user.email}
                </p>
              </div>
            ),
          },
          {
            key: "txRef",
            header: "Tx Reference",
            render: (p) => (
              <span
                className="font-mono text-xs text-[#6E6678] truncate max-w-[180px] block"
                title={p.txRef}
              >
                {p.txRef}
              </span>
            ),
          },
          {
            key: "type",
            header: "Type",
            width: "150px",
            render: (p) => (
              <AdminStatusBadge type="paymentType" value={p.paymentType} />
            ),
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

export default function AdminPaymentsPage() {
  usePageTitle("Payments | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminPaymentsContent />
    </AuthGuard>
  );
}
