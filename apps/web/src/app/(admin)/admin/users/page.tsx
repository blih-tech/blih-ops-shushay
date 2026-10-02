"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  UserPlus,
  Mail,
  UserX,
  UserCheck,
  Copy,
  Check,
  Shield,
} from "lucide-react";
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
import {
  fetchAdminUsers,
  deleteAdminUser,
  createAdminUser,
  resendAdminUserInvite,
  updateAdminUserStatus,
  updateAdminUserRole,
} from "@/lib/adminApi";
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
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [newRoleValue, setNewRoleValue] = useState<string>("TALENT");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [activeInviteLink, setActiveInviteLink] = useState<string | null>(null);

  // Create Admin state
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createAdminEmail, setCreateAdminEmail] = useState("");
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);
  const [createAdminSuccess, setCreateAdminSuccess] = useState<string | null>(null);
  const [createAdminInviteLink, setCreateAdminInviteLink] = useState<string | null>(null);

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
    setActionSuccess(null);
    try {
      await deleteAdminUser(deleteTarget.id);
      setActionSuccess(`User ${deleteTarget.email} deleted successfully.`);
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResendInvite(u: AdminUser) {
    setActionLoading(u.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await resendAdminUserInvite(u.id);
      if (res.inviteLink) {
        setActiveInviteLink(res.inviteLink);
        setActionSuccess(`Invite email resent to ${u.email}. Link: ${res.inviteLink}`);
      } else {
        setActionSuccess(`Invite email resent to ${u.email}.`);
      }
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to resend invite");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleStatus() {
    if (!statusTarget) return;
    const newStatus = !(statusTarget.isActive !== false);
    setActionLoading(statusTarget.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      await updateAdminUserStatus(statusTarget.id, newStatus);
      setActionSuccess(
        `User ${statusTarget.email} ${newStatus ? "activated" : "deactivated"} successfully.`,
      );
      setStatusTarget(null);
      load();
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateRole() {
    if (!roleTarget) return;
    setActionLoading(roleTarget.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      await updateAdminUserRole(roleTarget.id, newRoleValue);
      setActionSuccess(`User ${roleTarget.email} role changed to ${newRoleValue}.`);
      setRoleTarget(null);
      load();
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to update user role");
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
    setCreateAdminInviteLink(null);
    try {
      const newAdmin = await createAdminUser(createAdminEmail.trim());
      setCreateAdminSuccess(
        `Admin account created for ${newAdmin.email}. An invite email has been sent.`,
      );
      if (newAdmin.inviteLink) {
        setCreateAdminInviteLink(newAdmin.inviteLink);
      }
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
      {actionSuccess && (
        <Alert variant="success" onClose={() => { setActionSuccess(null); setActiveInviteLink(null); }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>{actionSuccess}</span>
            {activeInviteLink && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={copiedLinkId === activeInviteLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                onClick={() => {
                  navigator.clipboard.writeText(activeInviteLink);
                  setCopiedLinkId(activeInviteLink);
                  setTimeout(() => setCopiedLinkId(null), 2000);
                }}
              >
                {copiedLinkId === activeInviteLink ? "Copied!" : "Copy Link"}
              </Button>
            )}
          </div>
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
            width: "120px",
            render: (u) => (
              <button
                type="button"
                onClick={() => {
                  setRoleTarget(u);
                  setNewRoleValue(u.role);
                }}
                className="group inline-flex items-center gap-1 hover:opacity-80 transition-opacity text-left cursor-pointer"
                title="Click to change user role"
              >
                <AdminStatusBadge type="role" value={u.role} />
                <Shield className="h-3 w-3 text-[#6E6678] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ),
          },
          {
            key: "status",
            header: "Account Status",
            width: "130px",
            render: (u) =>
              u.isActive === false ? (
                <Badge variant="danger" size="sm">
                  Suspended
                </Badge>
              ) : (
                <Badge variant="verified" size="sm">
                  Active
                </Badge>
              ),
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
            width: "280px",
            render: (u) => (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  variant="ghost"
                  title="Resend invite or password reset email"
                  leftIcon={<Mail className="h-3.5 w-3.5" />}
                  onClick={() => handleResendInvite(u)}
                  isLoading={actionLoading === u.id}
                >
                  Resend Invite
                </Button>
                {u.isActive === false ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#2E8F79] hover:bg-[#E8F5E9]"
                    title="Activate account"
                    leftIcon={<UserCheck className="h-3.5 w-3.5 text-[#2E8F79]" />}
                    onClick={() => setStatusTarget(u)}
                    isLoading={actionLoading === u.id}
                  >
                    Activate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#D97706] hover:bg-[#FEF3C7]"
                    title="Suspend user account"
                    leftIcon={<UserX className="h-3.5 w-3.5 text-[#D97706]" />}
                    onClick={() => setStatusTarget(u)}
                    isLoading={actionLoading === u.id}
                  >
                    Suspend
                  </Button>
                )}
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

      {/* Suspend/Activate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!statusTarget}
        title={statusTarget?.isActive === false ? "Activate User Account" : "Suspend User Account"}
        message={
          statusTarget?.isActive === false
            ? `Are you sure you want to activate the account for "${statusTarget?.email}"? They will regain ability to log in and access the platform.`
            : `Are you sure you want to suspend the account for "${statusTarget?.email}"? They will be immediately blocked from logging in.`
        }
        confirmText={statusTarget?.isActive === false ? "Activate Account" : "Suspend Account"}
        cancelText="Cancel"
        variant={statusTarget?.isActive === false ? "primary" : "destructive"}
        onConfirm={handleToggleStatus}
        onClose={() => setStatusTarget(null)}
      />

      {/* Change Role Modal */}
      <Modal
        isOpen={!!roleTarget}
        onClose={() => setRoleTarget(null)}
        title="Change User Role"
        description={`Modify the platform access level for user ${roleTarget?.email}.`}
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRoleTarget(null)}
              disabled={actionLoading === roleTarget?.id}
            >
              Cancel
            </Button>
            <Button
              type="button"
              leftIcon={<Shield className="h-4 w-4" />}
              isLoading={actionLoading === roleTarget?.id}
              onClick={handleUpdateRole}
            >
              Save Role
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-[#6E6678]">
            Current Role: <strong className="text-[#17131F] font-mono">{roleTarget?.role}</strong>
          </p>
          <Select
            id="change-role-select"
            label="Select New Role"
            value={newRoleValue}
            onChange={(e) => setNewRoleValue(e.target.value)}
            options={[
              { value: "TALENT", label: "Talent (Standard User)" },
              { value: "COMPANY", label: "Company (Employer Account)" },
              { value: "ADMIN", label: "Admin (Full System Access)" },
            ]}
          />
        </div>
      </Modal>

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
              <div className="space-y-2">
                <p>{createAdminSuccess}</p>
                {createAdminInviteLink && (
                  <div className="pt-2 border-t border-[#D9CEDF] flex items-center justify-between gap-2">
                    <span className="text-xs font-mono truncate text-[#4A4154] max-w-[220px]">
                      {createAdminInviteLink}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      leftIcon={
                        copiedLinkId === createAdminInviteLink ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )
                      }
                      onClick={() => {
                        navigator.clipboard.writeText(createAdminInviteLink);
                        setCopiedLinkId(createAdminInviteLink);
                        setTimeout(() => setCopiedLinkId(null), 2000);
                      }}
                    >
                      {copiedLinkId === createAdminInviteLink ? "Copied!" : "Copy Link"}
                    </Button>
                  </div>
                )}
              </div>
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
