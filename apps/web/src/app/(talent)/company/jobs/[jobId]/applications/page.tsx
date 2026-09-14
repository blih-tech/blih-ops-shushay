"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function RedirectToJobDetail({ jobId }: { jobId: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/company/jobs/${jobId}`);
  }, [jobId, router]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm font-mono text-[#6E6678]">
      Navigating to candidate applications...
    </div>
  );
}

export default function CompanyJobApplicationsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <RedirectToJobDetail jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
