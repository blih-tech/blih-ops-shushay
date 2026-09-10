"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  Download,
} from "lucide-react";
import { Alert, Badge, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminCertificateById } from "@/lib/adminApi";

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
      } catch (err: any) {
        setError(err.message || "Failed to load certificate details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [certId]);

  if (loading) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[{ label: "Certificates", href: "/admin/certificates" }, { label: "Loading..." }]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !cert) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[{ label: "Certificates", href: "/admin/certificates" }, { label: "Error" }]}
        />
        <Alert variant="error">{error || "Certificate not found"}</Alert>
      </main>
    );
  }

  const recipientName =
    cert.user?.talentProfile?.fullName || cert.user?.email || "Unknown Recipient";
  const courseTitle = cert.course?.title || "Course Certificate";

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Certificates", href: "/admin/certificates" },
          { label: cert.certificateNumber || "Certificate" },
        ]}
      />

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                <Award className="h-7 w-[#7C3AED]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {courseTitle}
                  </h1>
                  <Badge variant="success">VERIFIED CERTIFICATE</Badge>
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-2">
                  Awarded to <span className="font-medium text-[#17131F]">{recipientName}</span>
                </p>
              </div>
            </div>

            {cert.pdfUrl && (
              <div className="flex items-center gap-2 shrink-0">
                <a href={cert.pdfUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />}>
                    PDF
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Integrated Stat Strip */}
          <div className="mt-6 pt-6 border-t border-[#EBE5F0] grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Certificate Code</p>
              <p className="font-mono font-semibold text-[#17131F] mt-0.5 truncate" title={cert.certificateNumber}>
                {cert.certificateNumber}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Issue Date</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {new Date(cert.createdAt || cert.issueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Verification Status</p>
              <p className="font-display font-semibold text-[#2E8F79] flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-4 w-4" /> Valid
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Certificate Details */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base text-[#17131F]">Certificate Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Certificate ID</p>
                <p className="font-mono text-xs text-[#17131F] break-all mt-1">{cert.id}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Course Title</p>
                <p className="font-medium text-[#17131F] mt-1">{courseTitle}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Issued Timestamp</p>
                <p className="font-medium text-[#17131F] mt-1">
                  {new Date(cert.createdAt || cert.issueDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Recipient Account */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-[#17131F]">Recipient Information</h2>
              {cert.user?.id && (
                <Link href={`/admin/users/${cert.user.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Recipient User Account →
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Full Name</p>
                <p className="font-medium text-[#17131F] mt-1">{recipientName}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Account Email</p>
                <p className="font-medium text-[#17131F] mt-1">{cert.user?.email || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminCertificateDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCertificateDetailContent />
    </AuthGuard>
  );
}
