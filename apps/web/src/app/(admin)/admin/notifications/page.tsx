"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Bell, Eye } from "lucide-react";
import { Alert, Badge, UniversalSearch, Pagination, Select } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminNotifications } from "@/lib/adminApi";
import type { AdminNotification } from "@/types/admin";
import { Button } from "@blih/ui";

const PAGE_SIZE = 25;

function AdminNotificationsContent() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminNotifications({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        type: typeFilter || undefined,
        read: readFilter || undefined,
      });
      setNotifications(data.notifications);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, typeFilter, readFilter]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, readFilter]);

  const recipientName = (n: AdminNotification) =>
    n.user.talentProfile?.fullName ||
    n.user.companyProfile?.companyName ||
    n.user.email.split("@")[0];

  const notificationTypes = [
    "NEW_JOB_APPLICATION",
    "CERTIFICATE_EARNED",
    "PAYMENT_CONFIRMED",
    "SUBSCRIPTION_CONFIRMED",
    "SUBSCRIPTION_EXPIRED",
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Notifications" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
              Notification Logs
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Platform notification log — all system and user notifications.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, message, or user email..."
          />
        </div>
        <Select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-44 shrink-0"
          options={[
            { value: "", label: "All Types" },
            ...notificationTypes.map((t) => ({
              value: t,
              label: t
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
            })),
          ]}
        />
        <Select
          id="read-filter"
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
          className="w-full sm:w-44 shrink-0"
          options={[
            { value: "", label: "All Statuses" },
            { value: "true", label: "Read" },
            { value: "false", label: "Unread" },
          ]}
        />
      </div>

      <AdminTable<AdminNotification>
        loading={loading}
        data={notifications}
        rowKey={(n) => n.id}
        emptyIcon={<Bell className="h-6 w-6" />}
        emptyTitle="No notifications found"
        emptySubtext={
          searchQuery || typeFilter
            ? "Try adjusting your filters."
            : "No notifications recorded yet."
        }
        columns={[
          {
            key: "recipient",
            header: "Recipient",
            render: (n) => (
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#17131F] truncate">
                  {recipientName(n)}
                </p>
                <p className="text-xs text-[#6E6678] truncate">
                  {n.user.email}
                </p>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            width: "90px",
            render: (n) => (
              <AdminStatusBadge type="role" value={n.user.role} size="sm" />
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (n) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {n.type.replace(/_/g, " ")}
              </span>
            ),
          },
          {
            key: "title",
            header: "Title",
            render: (n) => (
              <span className="text-sm text-[#17131F] truncate max-w-[200px] block">
                {n.title}
              </span>
            ),
          },
          {
            key: "read",
            header: "Read",
            width: "70px",
            render: (n) => (
              <div
                className={`w-2 h-2 rounded-full mx-auto ${n.read ? "bg-[#D9CEDF]" : "bg-[#1E5BFF]"}`}
              />
            ),
          },
          {
            key: "date",
            header: "Date",
            width: "110px",
            render: (n) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            width: "80px",
            render: (n) => (
              <Link href={`/admin/notifications/${n.id}`}>
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

export default function AdminNotificationsPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminNotificationsContent />
    </AuthGuard>
  );
}
