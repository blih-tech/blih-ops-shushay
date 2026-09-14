"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";
import { Button, Alert, ConfirmDialog, UniversalSearch } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import {
  fetchAdminCourses,
  publishCourse,
  unpublishCourse,
  deleteCourse,
} from "@/lib/courses";
import { AdminCourseCard } from "@/components/admin/AdminCourseCard";
import { AdminCourseSkeletonList } from "@/components/admin/AdminSkeletonList";
import type { Course } from "@/types/course";

function CoursesContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmCourse, setConfirmCourse] = useState<Course | null>(null);
  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState<Course | null>(
    null,
  );

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAdminCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePublishToggle(course: Course) {
    if (course.status === "PUBLISHED") {
      setConfirmCourse(course);
      return;
    }
    await doPublish(course);
  }

  async function doPublish(course: Course) {
    setActionLoading(course.id);
    setActionError(null);
    try {
      const updated =
        course.status === "PUBLISHED"
          ? await unpublishCourse(course.id)
          : await publishCourse(course.id);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, status: updated.status } : c,
        ),
      );
    } catch (err: any) {
      setActionError(err.message ?? "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function doDelete(course: Course) {
    setActionLoading(course.id);
    setActionError(null);
    try {
      await deleteCourse(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } catch (err: any) {
      setActionError(err.message ?? "Delete failed");
    } finally {
      setActionLoading(null);
    }
  }

  const filteredCourses = courses.filter((c, index, self) => {
    // Deduplicate duplicate seed/db entries by ID or Title
    const isFirstOccurrence =
      self.findIndex(
        (item) =>
          item.id === c.id ||
          item.title.toLowerCase() === c.title.toLowerCase(),
      ) === index;

    if (!isFirstOccurrence) return false;

    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.status && c.status.toLowerCase().includes(q))
    );
  });

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <AdminBreadcrumb items={[{ label: "Course Studio" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
            Manage Courses
          </h1>
          <p className="text-sm sm:text-base text-[#6E6678]">
            Create, edit, and publish courses for Blih Skills.
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            New Course
          </Button>
        </Link>
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

      <div className="w-full">
        <UniversalSearch
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses by title, topic, or status..."
        />
      </div>

      {loading && <AdminCourseSkeletonList />}

      {!loading && !error && filteredCourses.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#D9CEDF] rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#17131F]">
            {searchQuery ? "No matching courses found" : "No courses yet"}
          </h3>
          <p className="text-sm text-[#6E6678]">
            {searchQuery
              ? "Try a different search term."
              : "Create your first course to get started."}
          </p>
          {!searchQuery && (
            <Link href="/admin/courses/new">
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                Create Course
              </Button>
            </Link>
          )}
        </div>
      )}

      {!loading && filteredCourses.length > 0 && (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <AdminCourseCard
              key={course.id}
              course={course}
              isActing={actionLoading === course.id}
              onPublishToggle={handlePublishToggle}
              onDeleteClick={setDeleteConfirmCourse}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmCourse}
        title="Unpublish Course"
        message={`Are you sure you want to unpublish "${confirmCourse?.title}"? It will no longer be visible to students.`}
        confirmText="Unpublish"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (confirmCourse) {
            const c = confirmCourse;
            setConfirmCourse(null);
            await doPublish(c);
          }
        }}
        onClose={() => setConfirmCourse(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmCourse}
        title="Delete Course"
        message={`Are you sure you want to permanently delete "${deleteConfirmCourse?.title}"? This will delete all lessons, quizzes, assignments, and remove all files/videos from Cloudinary. This action cannot be undone.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (deleteConfirmCourse) {
            const c = deleteConfirmCourse;
            setDeleteConfirmCourse(null);
            await doDelete(c);
          }
        }}
        onClose={() => setDeleteConfirmCourse(null)}
      />
    </main>
  );
}

export default function AdminCoursesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <CoursesContent />
    </AuthGuard>
  );
}
