"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, BookOpen, Pencil, Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";
import {
  Button, Badge, Alert, Skeleton, EmptyState, ConfirmDialog, Card, CardContent, GlobalNavbar
} from "@/components/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAdminCourses, publishCourse, unpublishCourse } from "@/lib/courses";
import type { Course } from "@/types/course";

function CoursesContent() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmCourse, setConfirmCourse] = useState<Course | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAdminCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

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
      const updated = course.status === "PUBLISHED"
        ? await unpublishCourse(course.id)
        : await publishCourse(course.id);
      setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, status: updated.status } : c));
    } catch (err: any) {
      setActionError(err.message ?? "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased">
      <GlobalNavbar currentApp="courses" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        <Link href="/admin">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">
            Back to Admin Portal
          </Button>
        </Link>

        {/* Header */}
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

        {/* Errors */}
        {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
        {actionError && <Alert variant="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 bg-[#EEF3FF]/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#D9CEDF] rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#17131F]">No courses yet</h3>
            <p className="text-sm text-[#6E6678]">Create your first course to get started.</p>
            <Link href="/admin/courses/new">
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Create Course</Button>
            </Link>
          </div>
        )}

        {/* Course list */}
        {!loading && courses.length > 0 && (
          <div className="space-y-4">
            {courses.map((course) => {
              const isPublished = course.status === "PUBLISHED";
              const isActing = actionLoading === course.id;
              const lessonCount = course._count?.lessons ?? 0;
              return (
                <div
                  key={course.id}
                  className="bg-white border border-[#D9CEDF] rounded-3xl p-6 hover:border-[#1E5BFF]/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Icon + Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] flex items-center justify-center text-[#1E5BFF] shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#17131F] truncate">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={isPublished ? "verified" : "secondary"} size="sm">
                          {isPublished ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs font-mono text-[#6E6678]">
                          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={isPublished ? "outline" : "primary"}
                      size="sm"
                      isLoading={isActing}
                      onClick={() => handlePublishToggle(course)}
                      leftIcon={isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    >
                      {isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />}>
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Confirmation Modal */}
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
      </main>
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <CoursesContent />
    </AuthGuard>
  );
}
