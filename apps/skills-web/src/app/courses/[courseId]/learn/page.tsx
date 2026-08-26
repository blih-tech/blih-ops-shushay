"use client";

import React, { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

function LearnContent({ courseId }: { courseId: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
        Learning Room: Course {courseId}
      </h1>
      <div className="p-12 text-center bg-muted border border-border rounded-xl">
        <p className="text-sm text-body font-sans">
          This content is locked until course lessons are configured.
        </p>
      </div>
    </div>
  );
}

export default function LearnPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <LearnContent courseId={resolvedParams.courseId} />
    </AuthGuard>
  );
}
