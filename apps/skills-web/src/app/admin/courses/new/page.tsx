"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { createCourse } from "@/lib/courses";

function NewCourseContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate() {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    else if (title.trim().length > 200)
      e.title = "Title must be at most 200 characters";
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length > 2000)
      e.description = "Description must be at most 2000 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const course = await createCourse({
        title: title.trim(),
        description: description.trim(),
      });
      router.push("/admin/courses/" + course.id + "/edit");
    } catch (err: any) {
      setApiError(err.message ?? "Failed to create course");
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1.5">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Course Management
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Create Course
            </h1>
            <Badge variant="primary">DRAFT</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            New courses initialize in draft mode. You can add video lessons,
            quizzes, and publish when ready.
          </p>
        </div>
      </div>

      {apiError && (
        <Alert variant="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold font-display text-[#17131F]">
                Course Details
              </CardTitle>
              <CardDescription className="text-sm text-[#6E6678]">
                Basic metadata and syllabus overview presented to candidates in
                the catalog.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Course Title"
              id="course-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              placeholder="e.g. Remote Work Fundamentals & Async Collaboration"
              maxLength={200}
            />
            <Textarea
              id="course-description"
              label="Course Description & Outcomes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={2000}
              error={errors.description}
              placeholder="Describe what candidates will learn, key frameworks, and skills verified upon completion..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/admin/courses">
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Course & Add Lessons
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function NewCoursePage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <NewCourseContent />
    </AuthGuard>
  );
}
