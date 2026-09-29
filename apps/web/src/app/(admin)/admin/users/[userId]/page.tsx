"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, ConfirmDialog, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  fetchAdminUserById,
  deleteAdminUser,
  grantAdminSkillsAccess,
  revokeAdminSkillsAccess,
} from "@/lib/adminApi";
import { fetchAdminCourses } from "@/lib/courses";
import type { Course } from "@/types/course";

import { UserDetailHeader } from "@/components/admin/user-detail/UserDetailHeader";
import { UserDetailStats } from "@/components/admin/user-detail/UserDetailStats";
import { UserRoleProfileCard } from "@/components/admin/user-detail/UserRoleProfileCard";
import { UserCoursesCard } from "@/components/admin/user-detail/UserCoursesCard";
import { UserDetailSidebar } from "@/components/admin/user-detail/UserDetailSidebar";

function AdminUserDetailContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [revokingCourseId, setRevokingCourseId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [userData, coursesData] = await Promise.all([
          fetchAdminUserById(userId),
          fetchAdminCourses().catch(() => [] as Course[]),
        ]);
        setUser(userData);
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setSelectedCourseId(coursesData[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load user details");
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
      setActionError(err.message || "Failed to delete user account");
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleGrantAccess() {
    if (!selectedCourseId) {
      setActionError("Please select a course to grant access.");
      return;
    }
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await grantAdminSkillsAccess(userId, selectedCourseId);
      const updated = await fetchAdminUserById(userId);
      setUser(updated);
      setActionSuccess("Course access granted successfully.");
    } catch (err: any) {
      setActionError(err.message || "Failed to grant course access");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRevokeAccess(courseId: string) {
    setRevokingCourseId(courseId);
    setActionError(null);
    setActionSuccess(null);
    try {
      await revokeAdminSkillsAccess(userId, courseId);
      const updated = await fetchAdminUserById(userId);
      setUser(updated);
      setActionSuccess("Course access revoked successfully.");
    } catch (err: any) {
      setActionError(err.message || "Failed to revoke course access");
    } finally {
      setRevokingCourseId(null);
    }
  }

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading user profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm text-[#6E6678] hover:text-[#17131F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Link>
        </div>
        <Alert variant="error">{error || "User account not found."}</Alert>
      </main>
    );
  }

  const displayName =
    user.talentProfile?.fullName ||
    user.companyProfile?.companyName ||
    user.email.split("@")[0];

  const enrollments: any[] = user.courseEnrollments || [];
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const availableCoursesToGrant = courses.filter(
    (c) => !enrolledCourseIds.has(c.id),
  );

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">


      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}
      {actionSuccess && (
        <Alert variant="success" onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {/* Hero Header without ID and without top gradient */}
      <UserDetailHeader
        user={user}
        displayName={displayName}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      {/* 4 Metric Cards */}
      <UserDetailStats
        user={user}
        enrollmentsCount={enrollments.length}
      />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <UserRoleProfileCard user={user} />

          <UserCoursesCard
            enrollments={enrollments}
            availableCourses={availableCoursesToGrant}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onGrantAccess={handleGrantAccess}
            onRevokeAccess={handleRevokeAccess}
            actionLoading={actionLoading}
            revokingCourseId={revokingCourseId}
          />
        </div>

        <div className="lg:col-span-4">
          <UserDetailSidebar
            user={user}
            enrollmentsCount={enrollments.length}
            onDeleteClick={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete account "${user.email}"? All profiles, records, and access entitlements will be destroyed.`}
        confirmText="Yes, Delete Account"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        variant="destructive"
        isLoading={actionLoading}
      />
    </main>
  );
}

export default function AdminUserDetailPage() {
  usePageTitle("User Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminUserDetailContent />
    </AuthGuard>
  );
}
