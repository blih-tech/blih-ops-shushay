"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { createCourse } from "@/lib/courses";

function NewCourseContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate() {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    else if (title.trim().length > 200) e.title = "Title must be at most 200 characters";
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length > 2000) e.description = "Description must be at most 2000 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const course = await createCourse({ title: title.trim(), description: description.trim() });
      router.push("/admin/courses/" + course.id + "/edit");
    } catch (err: any) {
      setApiError(err.message ?? "Failed to create course");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link href="/admin/courses">
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">
          Back to Courses
        </Button>
      </Link>

      <div className="pb-4 border-b border-border">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Create Course</h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          New courses start as drafts. You can add lessons and publish when ready.
        </p>
      </div>

      {apiError && <Alert variant="error" onClose={() => setApiError(null)}>{apiError}</Alert>}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Details</CardTitle>
          <CardDescription>Basic information shown to learners in the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              id="course-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              placeholder="e.g. Remote Work Fundamentals"
              maxLength={200}
            />
            <div>
              <label htmlFor="course-description" className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="course-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={2000}
                placeholder="Describe what learners will gain from this course..."
                className={"appearance-none block w-full px-4 py-3 sm:py-2.5 min-h-[120px] bg-background text-foreground border rounded-md text-base sm:text-sm font-sans placeholder:text-muted-foreground transition-colors duration-interactive focus:outline-none focus:ring-2 disabled:bg-muted disabled:opacity-60 resize-none " + (errors.description ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary focus:ring-primary/20")}
              />
              <div className="flex justify-between mt-1.5">
                {errors.description ? (
                  <p className="text-xs text-destructive font-sans">{errors.description}</p>
                ) : <div />}
                <p className="text-xs text-muted-foreground font-mono">{description.length} / 2000</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" isLoading={submitting}>
                Create Course
              </Button>
              <Link href="/admin/courses">
                <Button type="button" variant="outline" disabled={submitting}>Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewCoursePage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <NewCourseContent />
    </AuthGuard>
  );
}