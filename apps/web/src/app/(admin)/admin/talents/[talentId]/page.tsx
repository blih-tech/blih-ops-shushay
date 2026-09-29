"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, ConfirmDialog, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  fetchAdminTalentById,
  deleteAdminUser,
  grantAdminSkillsAccess,
  revokeAdminSkillsAccess,
} from "@/lib/adminApi";
import { fetchAdminCourses } from "@/lib/courses";
import type { Course } from "@/types/course";

import { TalentDetailHeader } from "@/components/admin/talent-detail/TalentDetailHeader";
import { TalentDetailStats } from "@/components/admin/talent-detail/TalentDetailStats";
import { TalentExperienceCard } from "@/components/admin/talent-detail/TalentExperienceCard";
import { TalentPortfolioCard } from "@/components/admin/talent-detail/TalentPortfolioCard";
import { TalentCoursesCard } from "@/components/admin/talent-detail/TalentCoursesCard";
import { TalentDetailSidebar } from "@/components/admin/talent-detail/TalentDetailSidebar";

function AdminTalentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const talentId = params.talentId as string;

  const [talent, setTalent] = useState<any>(null);
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
        const [talentData, coursesData] = await Promise.all([
          fetchAdminTalentById(talentId),
          fetchAdminCourses().catch(() => [] as Course[]),
        ]);
        setTalent(talentData);
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setSelectedCourseId(coursesData[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load talent profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [talentId]);

  async function handleDelete() {
    if (!talent?.user?.id) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteAdminUser(talent.user.id);
      router.push("/admin/talents");
    } catch (err: any) {
      setActionError(err.message || "Failed to delete talent account");
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleGrantAccess() {
    if (!talent?.user?.id || !selectedCourseId) {
      setActionError("Please select a course to grant access.");
      return;
    }
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await grantAdminSkillsAccess(talent.user.id, selectedCourseId);
      const updated = await fetchAdminTalentById(talentId);
      setTalent(updated);
      setActionSuccess("Course access granted successfully.");
    } catch (err: any) {
      setActionError(err.message || "Failed to grant course access");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRevokeAccess(courseId: string) {
    if (!talent?.user?.id) return;
    setRevokingCourseId(courseId);
    setActionError(null);
    setActionSuccess(null);
    try {
      await revokeAdminSkillsAccess(talent.user.id, courseId);
      const updated = await fetchAdminTalentById(talentId);
      setTalent(updated);
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
            Loading talent profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !talent) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Talent profile not found."}</Alert>
      </main>
    );
  }

  const enrollments: any[] = talent.user?.courseEnrollments || [];
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

      {/* Hero Header */}
      <TalentDetailHeader
        talent={talent}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      {/* 4 Metric Cards */}
      <TalentDetailStats talent={talent} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Experience, Education, Portfolio & Courses */}
        <div className="lg:col-span-8 space-y-6">
          <TalentExperienceCard talent={talent} />

          <TalentPortfolioCard talent={talent} />

          <TalentCoursesCard
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

        {/* Right Column (4 cols): Information, Skills & Danger Zone */}
        <div className="lg:col-span-4">
          <TalentDetailSidebar
            talent={talent}
            onDeleteClick={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Talent Account"
        message={`Are you sure you want to permanently delete talent profile "${talent.fullName}"? All records, applications, and enrollments will be erased.`}
        confirmText="Yes, Delete Account"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        variant="destructive"
        isLoading={actionLoading}
      />
    </main>
  );
}

export default function AdminTalentDetailPage() {
  usePageTitle("Talent Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminTalentDetailContent />
    </AuthGuard>
  );
}
