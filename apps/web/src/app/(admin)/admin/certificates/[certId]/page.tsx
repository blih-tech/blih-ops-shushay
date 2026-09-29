"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { fetchAdminCertificateById } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";

import { CertificateDetailHeader } from "@/components/admin/certificate-detail/CertificateDetailHeader";
import { CertificateDetailStats } from "@/components/admin/certificate-detail/CertificateDetailStats";
import { CertificateOverviewCard } from "@/components/admin/certificate-detail/CertificateOverviewCard";
import { CertificateDetailSidebar } from "@/components/admin/certificate-detail/CertificateDetailSidebar";

function AdminCertificateDetailContent() {
  const params = useParams();
  const certId = params.certId as string;

  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminCertificateById(certId);
        setCert(data);
      } catch (err: unknown) {
        setError(
          getErrorMessage(err) || "Failed to load certificate details",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [certId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading certificate details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !cert) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Certificate record not found."}</Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <CertificateDetailHeader cert={cert} />

      {/* 4 Metric Cards */}
      <CertificateDetailStats cert={cert} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Course Overview & Verification Statement */}
        <div className="lg:col-span-8">
          <CertificateOverviewCard cert={cert} />
        </div>

        {/* Right Column (4 cols): Recipient Account & Credential Security */}
        <div className="lg:col-span-4">
          <CertificateDetailSidebar cert={cert} />
        </div>
      </div>
    </main>
  );
}

export default function AdminCertificateDetailPage() {
  usePageTitle("Certificate Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCertificateDetailContent />
    </AuthGuard>
  );
}
