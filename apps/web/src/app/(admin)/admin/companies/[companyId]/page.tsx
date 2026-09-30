"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, ConfirmDialog, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { fetchAdminCompanyById, deleteAdminUser } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";
import type { AdminCompanyDetail } from "@/types/admin";

import { CompanyDetailHeader } from "@/components/admin/company-detail/CompanyDetailHeader";
import { CompanyDetailStats } from "@/components/admin/company-detail/CompanyDetailStats";
import { CompanyOverviewCard } from "@/components/admin/company-detail/CompanyOverviewCard";
import { CompanyJobsCard } from "@/components/admin/company-detail/CompanyJobsCard";
import { CompanyDetailSidebar } from "@/components/admin/company-detail/CompanyDetailSidebar";

function AdminCompanyDetailContent() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<AdminCompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminCompanyById(companyId);
        setCompany(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "Failed to load company profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId]);

  async function handleDelete() {
    if (!company?.user?.id) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deleteAdminUser(company.user.id);
      router.push("/admin/companies");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err) || "Failed to delete company account");
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading company profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Company profile not found."}</Alert>
      </main>
    );
  }

  const jobs = company.jobs || [];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Hero Header */}
      <CompanyDetailHeader
        company={company}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      {/* 4 Metric Cards */}
      <CompanyDetailStats company={company} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Overview & Jobs */}
        <div className="lg:col-span-8 space-y-6">
          <CompanyOverviewCard company={company} />
          <CompanyJobsCard jobs={jobs} />
        </div>

        {/* Right Column (4 cols): Subscription & Security & Danger Zone */}
        <div className="lg:col-span-4">
          <CompanyDetailSidebar
            company={company}
            onDeleteClick={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Company Account"
        message={`Are you sure you want to permanently delete company "${company.companyName}"? All published jobs, applicant records, and subscription access will be erased.`}
        confirmText="Yes, Delete Account"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        variant="destructive"
        isLoading={actionLoading}
      />
    </main>
  );
}

export default function AdminCompanyDetailPage() {
  usePageTitle("Company Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCompanyDetailContent />
    </AuthGuard>
  );
}
