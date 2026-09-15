"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Users, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import {
  Button,
  Alert,
  ConfirmDialog,
  UniversalSearch,
  Pagination,
  Select,
  Badge,
} from "@blih/ui";
import Link from "next/link";
import { AuthGuard as AuthGuardComponent } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminUsers, deleteAdminUser } from "@/lib/adminApi";
import type { AdminUser } from "@/types/admin";

const PAGE_SIZE = 20;

function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    setActionError(null);
    try {
      await deleteAdminUser(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  }

  const displayName = (u: AdminUser) =>
    u.talentProfile?.fullName ||
    u.companyProfile?.companyName ||
    u.email.split("@")[0];

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <AdminBreadcrumb items={[{ label: "Users" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
              User Management
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Manage all registered user accounts, roles, and platform access.
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email, name, or company..."
          />
        </div>
        <Select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-44 shrink-0"
          options={[
            { value: "", label: "All Roles" },
            { value: "TALENT", label: "Talent" },
            { value: "COMPANY", label: "Company" },
            { value: "ADMIN", label: "Admin" },
          ]}
        />
      </div>

      {/* Table */}
      <AdminTable<AdminUser>
        loading={loading}
        data={users}
        rowKey={(u) => u.id}
        emptyIcon={<Users className="h-6 w-6" />}
        emptyTitle="No users found"
        emptySubtext={
          searchQuery || roleFilter
            ? "Try adjusting your filters."
            : "No users registered yet."
        }
        columns={[
          {
            key: "user",
            header: "User",
            render: (u) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                  {u.companyProfile?.logoUrl || u.talentProfile?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        (u.companyProfile?.logoUrl ||
                          u.talentProfile?.photoUrl)!
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName(u).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">
                    {displayName(u)}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            width: "100px",
            render: (u) => <AdminStatusBadge type="role" value={u.role} />,
          },
          {
            key: "emailVerified",
            header: "Email Verified",
            width: "120px",
            render: (u) =>
              u.emailVerified ? (
                <span className="inline-flex items-center gap-1 font-mono text-xs text-[#2E8F79] font-medium">
                  <CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono text-xs text-[#6E6678]">
                  <XCircle className="h-3.5 w-3.5 text-[#6E6678]" /> Pending
                </span>
              ),
          },
          {
            key: "skills",
            header: "Skills Access",
            width: "120px",
            render: (u) =>
              u.role === "TALENT" ? (
                u.skillsEntitlement ? (
                  <Badge variant="verified" size="sm">
                    Granted
                  </Badge>
                ) : (
                  <Badge variant="secondary" size="sm">
                    None
                  </Badge>
                )
              ) : (
                <span className="text-[#6E6678] text-xs">—</span>
              ),
          },
          {
            key: "location",
            header: "Location",
            render: (u) => (
              <span className="text-sm text-[#6E6678]">
                {u.talentProfile?.city || u.companyProfile?.city || "—"}
              </span>
            ),
          },
          {
            key: "joined",
            header: "Joined",
            width: "110px",
            render: (u) => (
              <span className="text-xs text-[#6E6678] font-mono">
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            width: "160px",
            render: (u) => (
              <div className="flex items-center gap-1.5">
                <Link href={`/admin/users/${u.id}`}>
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
                  onClick={() => setDeleteTarget(u)}
                  isLoading={actionLoading === u.id}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the account for "${deleteTarget?.email}"? This will delete their profile, history, and all associated data. This action cannot be undone.`}
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
}

export default function AdminUsersPage() {
  return (
    <AuthGuardComponent allowedRoles={["ADMIN"]}>
      <AdminUsersContent />
    </AuthGuardComponent>
  );
}
