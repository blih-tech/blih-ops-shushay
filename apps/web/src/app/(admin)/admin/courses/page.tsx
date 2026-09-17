"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, GraduationCap, BookOpen, Pencil, Trash2, CheckCircle, EyeOff } from "lucide-react";
import { Button, Alert, Badge, ConfirmDialog, UniversalSearch } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  fetchAdminCourses,
  publishCourse,
  unpublishCourse,
  deleteCourse,
} from "@/lib/courses";
import { AdminTable } from "@/components/admin/AdminTable";
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
    <main className="w-full px-6 py-6 space-y-8 font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
            Manage Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
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

      <AdminTable<Course>
        loading={loading}
        data={filteredCourses}
        rowKey={(c) => c.id}
        emptyIcon={<GraduationCap className="h-6 w-6" />}
        emptyTitle={searchQuery ? "No matching courses found" : "No courses yet"}
        emptySubtext={
          searchQuery
            ? "Try a different search term."
            : "Create your first course to get started."
        }
        columns={[
          {
            key: "course",
            header: "Course",
            render: (c) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] flex items-center justify-center text-[#1E5BFF] shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#17131F] truncate">{c.title}</p>
                  <Badge
                    variant={c.status === "PUBLISHED" ? "verified" : "secondary"}
                    size="sm"
                  >
                    {c.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            ),
          },
          {
            key: "lessons",
            header: "Lessons",
            width: "100px",
            render: (c) => (
              <span className="font-mono text-sm text-[#6E6678]">
                {c._count?.lessons ?? 0}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            width: "240px",
            render: (c) => (
              <div className="flex items-center gap-2 justify-end">
                <Button
                  size="sm"
                  variant={c.status === "PUBLISHED" ? "outline" : "secondary"}
                  isLoading={actionLoading === c.id}
                  onClick={() => handlePublishToggle(c)}
                  leftIcon={
                    c.status === "PUBLISHED" ? (
                      <EyeOff className="h-3.5 w-3.5 text-[#D97706]" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />
                    )
                  }
                >
                  {c.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </Button>
                <Link href={`/admin/courses/${c.id}/edit`}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  >
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setDeleteConfirmCourse(c)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

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
