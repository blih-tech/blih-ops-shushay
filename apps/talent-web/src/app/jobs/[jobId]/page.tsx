"use client";

import React, { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function JobDetailsContent({ jobId }: { jobId: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
        Job Opportunity Details
      </h1>
      <div className="p-8 bg-card border border-border rounded-xl space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Position ID: {jobId}</h2>
        <p className="text-sm text-body">
          Complete details and application form will load in future phases.
        </p>
      </div>
    </div>
  );
}

export default function JobDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <JobDetailsContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
