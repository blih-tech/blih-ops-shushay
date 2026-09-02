import React, { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function CompanyJobApplicationsContent({ jobId }: { jobId: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
        Review Applications
      </h1>
      <div className="p-8 bg-card border border-border rounded-xl">
        <h3 className="text-md font-semibold text-foreground mb-2">
          Job Listing ID: {jobId}
        </h3>
        <p className="text-sm text-body">
          No applicants have applied for this position yet.
        </p>
      </div>
    </div>
  );
}

export default function CompanyJobApplicationsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyJobApplicationsContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
