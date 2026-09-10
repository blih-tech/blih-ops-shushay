"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Alert, Badge, Button, ConfirmDialog } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import {
  fetchAdminUserById,
  deleteAdminUser,
  grantAdminSkillsAccess,
  revokeAdminSkillsAccess,
} from "@/lib/adminApi";

function AdminUserDetailContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminUserById(userId);
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  async function handleDelete() {
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteAdminUser(userId);
      router.push("/admin/users");
    } catch (err: any) {
      setActionError(err.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleGrantAccess() {
    setActionLoading(true);
    setActionError(null);
    try {
      await grantAdminSkillsAccess(userId);
      const updated = await fetchAdminUserById(userId);
      setUser(updated);
    } catch (err: any) {
      setActionError(err.message || "Failed to grant skills access");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRevokeAccess() {
    setActionLoading(true);
    setActionError(null);
    try {
      await revokeAdminSkillsAccess(userId);
      const updated = await fetchAdminUserById(userId);
      setUser(updated);
    } catch (err: any) {
      setActionError(err.message || "Failed to revoke skills access");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb items={[{ label: "Users", href: "/admin/users" }, { label: "Loading..." }]} />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb items={[{ label: "Users", href: "/admin/users" }, { label: "Error" }]} />
        <Alert variant="error">{error || "User not found"}</Alert>
      </main>
    );
  }

  const displayName =
    user.talentProfile?.fullName ||
    user.companyProfile?.companyName ||
    user.email.split("@")[0];

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Users", href: "/admin/users" },
          { label: displayName },
        ]}
      />

      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-xl shrink-0">
                {user.talentProfile?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.talentProfile.photoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {displayName}
                  </h1>
                  <AdminStatusBadge type="role" value={user.role} />
                  {user.skillsEntitlement && (
                    <Badge variant="success">SKILLS ACCESS</Badge>
                  )}
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                  <span className="text-[#D9CEDF]">·</span>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 sm:pt-0">
              {user.skillsEntitlement ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRevokeAccess}
                  isLoading={actionLoading}
                  leftIcon={<XCircle className="h-3.5 w-3.5 text-[#D32F2F]" />}
                >
                  Revoke Access
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleGrantAccess}
                  isLoading={actionLoading}
                  leftIcon={<CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />}
                >
                  Grant Access
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              >
                Delete Account
              </Button>
            </div>
          </div>

          {/* Integrated Stat Strip */}
          <div className="mt-6 pt-6 border-t border-[#EBE5F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Account Role</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">{user.role}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Email Verification</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {user.emailVerified ? "Verified" : "Unverified"}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Certificates Earned</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {user._count?.certificates || 0}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Transactions</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {user._count?.paymentTransactions || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Account Details */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base text-[#17131F]">Account Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">User ID</p>
                <p className="font-mono text-xs text-[#17131F] break-all mt-1">{user.id}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Email Address</p>
                <p className="font-medium text-[#17131F] mt-1">{user.email}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Blih Skills Access</p>
                <p className="font-medium text-[#17131F] mt-1 flex items-center gap-1.5">
                  {user.skillsEntitlement ? (
                    <span className="text-[#2E8F79] flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Granted on{" "}
                      {new Date(user.skillsEntitlement.grantedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-[#6E6678]">Not granted</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Talent Profile section */}
          {user.talentProfile && (
            <div className="pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-[#17131F]">Associated Talent Profile</h2>
                <Link href={`/admin/talents/${user.talentProfile.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Full Profile →
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Full Name</p>
                  <p className="font-medium text-[#17131F] mt-1">{user.talentProfile.fullName}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Professional Title</p>
                  <p className="font-medium text-[#17131F] mt-1">{user.talentProfile.title || "—"}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Location</p>
                  <p className="font-medium text-[#17131F] mt-1">
                    {[user.talentProfile.city, user.talentProfile.country].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </div>
              {user.talentProfile.skills && user.talentProfile.skills.length > 0 && (
                <div className="pt-2">
                  <p className="font-mono text-xs text-[#6E6678] uppercase mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.talentProfile.skills.map((s: string) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Company Profile section */}
          {user.companyProfile && (
            <div className="pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-[#17131F]">Associated Company Profile</h2>
                <Link href={`/admin/companies/${user.companyProfile.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Full Profile →
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Company Name</p>
                  <p className="font-medium text-[#17131F] mt-1">{user.companyProfile.companyName}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Website</p>
                  <p className="font-medium text-[#17131F] mt-1">{user.companyProfile.website || "—"}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Location</p>
                  <p className="font-medium text-[#17131F] mt-1">
                    {[user.companyProfile.city, user.companyProfile.country].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to delete user account "${user.email}"? This action is permanent.`}
        confirmText="Delete User"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        variant="destructive"
      />
    </main>
  );
}

export default function AdminUserDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminUserDetailContent />
    </AuthGuard>
  );
}
