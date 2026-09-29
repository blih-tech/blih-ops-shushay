"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { fetchAdminApplicationById } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";

import { ApplicationDetailHeader } from "@/components/admin/application-detail/ApplicationDetailHeader";
import { ApplicationDetailStats } from "@/components/admin/application-detail/ApplicationDetailStats";
import { ApplicationCoverLetterCard } from "@/components/admin/application-detail/ApplicationCoverLetterCard";
import { ApplicationDetailSidebar } from "@/components/admin/application-detail/ApplicationDetailSidebar";

function AdminApplicationDetailContent() {
  const params = useParams();
  const appId = params.appId as string;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminApplicationById(appId);
        setApplication(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "Failed to load application details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading application record...
          </p>
        </div>
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Application record not found."}</Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <ApplicationDetailHeader application={application} />

      {/* 4 Metric Cards */}
      <ApplicationDetailStats application={application} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Cover Letter & Resume Documents */}
        <div className="lg:col-span-8">
          <ApplicationCoverLetterCard application={application} />
        </div>

        {/* Right Column (4 cols): Candidate & Job Entity Information */}
        <div className="lg:col-span-4">
          <ApplicationDetailSidebar application={application} />
        </div>
      </div>
    </main>
  );
}

export default function AdminApplicationDetailPage() {
  usePageTitle("Application Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminApplicationDetailContent />
    </AuthGuard>
  );
}
