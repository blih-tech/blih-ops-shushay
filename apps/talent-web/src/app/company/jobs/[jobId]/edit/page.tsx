import React, { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function CompanyEditJobContent({ jobId }: { jobId: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
        Edit Job Post
      </h1>
      <div className="p-8 bg-card border border-border rounded-xl">
        <h3 className="text-md font-semibold text-foreground">
          Job ID: {jobId}
        </h3>
      </div>
    </div>
  );
}

export default function CompanyEditJobPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyEditJobContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
