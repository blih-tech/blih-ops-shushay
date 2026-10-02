"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Users, Trash2, CheckCircle, XCircle, Eye, UserPlus } from "lucide-react";
import {
  Button,
  Alert,
  ConfirmDialog,
  UniversalSearch,
  Pagination,
  Select,
  Badge,
  Modal,
  Input,
} from "@blih/ui";
import Link from "next/link";
import { AuthGuard as AuthGuardComponent } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { fetchAdminUsers, deleteAdminUser, createAdminUser } from "@/lib/adminApi";
import type { AdminUser } from "@/types/admin";
import { getErrorMessage } from "@blih/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

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

  // Create Admin state
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createAdminEmail, setCreateAdminEmail] = useState("");
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);
  const [createAdminSuccess, setCreateAdminSuccess] = useState<string | null>(null);

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
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to load users");
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
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!createAdminEmail.trim()) return;
    setCreateAdminLoading(true);
    setCreateAdminError(null);
    setCreateAdminSuccess(null);
    try {
      const newAdmin = await createAdminUser(createAdminEmail.trim());
      setCreateAdminSuccess(
        `Admin account created for ${newAdmin.email}. An invite email has been sent so they can set their password.`,
      );
      setCreateAdminEmail("");
      load();
    } catch (err: unknown) {
      setCreateAdminError(getErrorMessage(err) || "Failed to create admin");
    } finally {
      setCreateAdminLoading(false);
    }
  }

  const displayName = (u: AdminUser) =>
    u.talentProfile?.fullName ||
    u.companyProfile?.companyName ||
    u.email.split("@")[0];

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="w-full px-6 py-6 space-y-8">
      {/* Breadcrumb */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
              User Management
            </h1>
            <Badge variant="primary">{total} TOTAL</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
            Manage user accounts, roles, and status across the platform.
          </p>
        </div>
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => {
            setShowCreateAdmin(true);
            setCreateAdminEmail("");
            setCreateAdminError(null);
            setCreateAdminSuccess(null);
          }}
        >
          Create Admin
        </Button>
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
      <div className="flex flex-col sm:flex-row items-start gap-3 w-full">
        <UniversalSearch
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email, name, or company..."
          className="flex-1 w-full"
        />
        <Select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-40 shrink-0"
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
                <div className="w-8 h-8 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-2xs">
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

      {/* Create Admin Modal */}
      <Modal
        isOpen={showCreateAdmin}
        onClose={() => setShowCreateAdmin(false)}
        title="Create Admin Account"
        description="Enter the email address of the new admin. They will receive an invite email with a link to set their own password."
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateAdmin(false)}
              disabled={createAdminLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              leftIcon={<UserPlus className="h-4 w-4" />}
              isLoading={createAdminLoading}
              onClick={(e) => handleCreateAdmin(e as any)}
            >
              Send Invite
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4 py-2">
          {createAdminError && (
            <Alert variant="error" onClose={() => setCreateAdminError(null)}>
              {createAdminError}
            </Alert>
          )}
          {createAdminSuccess && (
            <Alert variant="success" onClose={() => setCreateAdminSuccess(null)}>
              {createAdminSuccess}
            </Alert>
          )}
          <Input
            id="create-admin-email"
            type="email"
            label="Email address"
            required
            value={createAdminEmail}
            onChange={(e) => setCreateAdminEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={createAdminLoading}
            fullWidth
          />
          {/* Hidden submit for Enter key support */}
          <button type="submit" className="hidden" aria-hidden="true" />
        </form>
      </Modal>
    </main>
  );
}

export default function AdminUsersPage() {
  usePageTitle("Users | Admin");
  return (
    <AuthGuardComponent allowedRoles={["ADMIN"]}>
      <AdminUsersContent />
    </AuthGuardComponent>
  );
}
