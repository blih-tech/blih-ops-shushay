"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Shield,
} from "lucide-react";
import { Alert, Badge, Button, ConfirmDialog, MetricCard } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
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
      <main className="w-full px-6 py-6 space-y-6">

        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="w-full px-6 py-6 space-y-4">

        <Alert variant="error">{error || "User not found"}</Alert>
      </main>
    );
  }

  const displayName =
    user.talentProfile?.fullName ||
    user.companyProfile?.companyName ||
    user.email.split("@")[0];

  return (
    <main className="w-full px-6 py-6 space-y-4">


      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard value={user.role} label="Role" variant="primary" />
        <MetricCard
          value={user.emailVerified ? "Verified" : "Unverified"}
          label="Email Status"
          variant="surface"
        />
        {user.role === "TALENT" ? (
          <>
            <MetricCard
              value={user.talentProfile?._count?.jobApplications ?? 0}
              label="Applications"
              variant="surface"
            />
            <MetricCard
              value={user._count?.certificates ?? 0}
              label="Certificates"
              variant="surface"
            />
          </>
        ) : user.role === "COMPANY" ? (
          <>
            <MetricCard
              value={user.companyProfile?._count?.jobs ?? 0}
              label="Jobs Posted"
              variant="surface"
            />
            <MetricCard
              value={
                user.companyProfile?.companySubscription?.status ||
                (user.companyProfile?.subscriptionActive ? "ACTIVE" : "INACTIVE")
              }
              label="Subscription"
              variant="surface"
            />
          </>
        ) : (
          <>
            <MetricCard
              value={user._count?.certificates ?? 0}
              label="Certificates"
              variant="surface"
            />
            <MetricCard
              value={user._count?.paymentTransactions ?? 0}
              label="Transactions"
              variant="surface"
            />
          </>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-2xl shrink-0 overflow-hidden">
                {user.talentProfile?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.talentProfile.photoUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl aspect-square"
                  />
                ) : user.companyProfile?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.companyProfile.logoUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl aspect-square"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {displayName}
                  </h1>
                  <AdminStatusBadge type="role" value={user.role} />
                  {user.skillsEntitlement && (
                    <Badge variant="success">SKILLS ACCESS</Badge>
                  )}
                </div>
                {/* Inline data chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Mail className="h-3 w-3 shrink-0" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Shield className="h-3 w-3 shrink-0 text-[#6E6678]" />
                    <span
                      className={
                        user.emailVerified ? "text-[#2E8F79]" : "text-[#D97706]"
                      }
                    >
                      Email {user.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
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
                  leftIcon={
                    <CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />
                  }
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
        </div>

        {/* Content Body */}
        <div className="divide-y divide-[#EBE5F0]">
          {/* Account Overview */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
              Account Overview
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                <span className="text-xs text-[#6E6678] w-40 shrink-0">
                  User ID
                </span>
                <code className="font-mono text-xs text-[#17131F] bg-[#F9F8FC] border border-[#EBE5F0] px-2.5 py-1.5 rounded-lg break-all text-right">
                  {user.id}
                </code>
              </div>
              {user.role === "TALENT" && (
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Job Applications
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {user.talentProfile?._count?.jobApplications ?? 0}
                  </span>
                </div>
              )}
              {user.role === "COMPANY" && (
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Jobs Posted
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {user.companyProfile?._count?.jobs ?? 0}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                <span className="text-xs text-[#6E6678] w-40 shrink-0">
                  Certificates Earned
                </span>
                <span className="font-medium text-sm text-[#17131F]">
                  {user._count?.certificates ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                <span className="text-xs text-[#6E6678] w-40 shrink-0">
                  Payment Transactions
                </span>
                <span className="font-medium text-sm text-[#17131F]">
                  {user._count?.paymentTransactions ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2">
                <span className="text-xs text-[#6E6678] w-40 shrink-0">
                  Blih Skills Access
                </span>
                <span className="font-medium text-sm">
                  {user.skillsEntitlement ? (
                    <span className="text-[#2E8F79] flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Granted{" "}
                      {new Date(
                        user.skillsEntitlement.grantedAt,
                      ).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-[#6E6678]">Not granted</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Talent Profile section */}
          {user.talentProfile && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                  Associated Talent Profile
                </h2>
                <Link href={`/admin/talents/${user.talentProfile.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Profile →
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Full Name
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {user.talentProfile.fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Professional Title
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {user.talentProfile.title || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Location
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {[user.talentProfile.city, user.talentProfile.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
              </div>
              {user.talentProfile.skills &&
                user.talentProfile.skills.length > 0 && (
                  <div className="pt-2 border-t border-[#F9F8FC] flex items-center gap-2 text-xs font-mono text-[#6E6678]">
                    <span className="text-[#17131F] font-semibold">Skills: </span>
                    <span>{user.talentProfile.skills.join(" · ")}</span>
                  </div>
                )}
            </div>
          )}

          {/* Company Profile section */}
          {user.companyProfile && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                  Associated Company Profile
                </h2>
                <Link href={`/admin/companies/${user.companyProfile.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Profile →
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Company Name
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {user.companyProfile.companyName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Website
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {user.companyProfile.website || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-xs text-[#6E6678] w-40 shrink-0">
                    Location
                  </span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {[user.companyProfile.city, user.companyProfile.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
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
