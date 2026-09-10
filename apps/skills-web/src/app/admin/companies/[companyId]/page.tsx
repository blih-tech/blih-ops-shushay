"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Eye,
} from "lucide-react";
import { Alert, Badge, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminCompanyById } from "@/lib/adminApi";

function AdminCompanyDetailContent() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminCompanyById(companyId);
        setCompany(data);
      } catch (err: any) {
        setError(err.message || "Failed to load company profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId]);

  if (loading) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[{ label: "Companies", href: "/admin/companies" }, { label: "Loading..." }]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[{ label: "Companies", href: "/admin/companies" }, { label: "Error" }]}
        />
        <Alert variant="error">{error || "Company profile not found"}</Alert>
      </main>
    );
  }

  const sub = company.companySubscription;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Companies", href: "/admin/companies" },
          { label: company.companyName },
        ]}
      />

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-2xl shrink-0 overflow-hidden">
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  company.companyName?.charAt(0).toUpperCase() || "C"
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {company.companyName}
                  </h1>
                  {sub ? (
                    <AdminStatusBadge type="subscription" value={sub.status} />
                  ) : (
                    <Badge variant="secondary">NO SUBSCRIPTION</Badge>
                  )}
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-3 flex-wrap">
                  {company.user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {company.user.email}
                    </span>
                  )}
                  {(company.city || company.country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {[company.city, company.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[#1E5BFF] hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Website
                    </a>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {company.user?.id && (
                <Link href={`/admin/users/${company.user.id}`}>
                  <Button size="sm" variant="outline">
                    User Account
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Integrated Stat Strip */}
          <div className="mt-6 pt-6 border-t border-[#EBE5F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Contact Email</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5 truncate">{company.contactEmail || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Contact Phone</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">{company.contactPhone || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Active Jobs</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {company.jobs?.length || 0}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Current Plan</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {sub?.plan || "Free"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Company Overview / Description */}
          {company.description && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-base text-[#17131F]">Company Overview</h2>
              <p className="text-sm text-[#6E6678] leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </div>
          )}

          {/* Subscription Info */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-[#17131F]">Subscription Overview</h2>
              {sub?.id && (
                <Link href={`/admin/subscriptions/${sub.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Subscription Details →
                  </Button>
                </Link>
              )}
            </div>
            {sub ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Plan</p>
                  <p className="font-medium text-[#17131F] mt-1">{sub.plan}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Status</p>
                  <div className="mt-1">
                    <AdminStatusBadge type="subscription" value={sub.status} />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Amount</p>
                  <p className="font-medium text-[#17131F] mt-1">{sub.amount} {sub.currency}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">Expires Date</p>
                  <p className="font-medium text-[#17131F] mt-1">
                    {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : "Never"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6E6678]">Company does not have an active paid subscription.</p>
            )}
          </div>

          {/* Job Postings */}
          <div className="pt-8 space-y-4">
            <h2 className="font-display font-bold text-base text-[#17131F] flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#1E5BFF]" /> Job Postings ({company.jobs?.length || 0})
            </h2>
            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-3 divide-y divide-[#EBE5F0]">
                {company.jobs.map((job: any) => (
                  <div key={job.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#17131F] text-sm">{job.title}</p>
                      <p className="text-xs text-[#6E6678] font-mono">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AdminStatusBadge type="job" value={job.status} />
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6E6678]">No job postings recorded for this company.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminCompanyDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCompanyDetailContent />
    </AuthGuard>
  );
}
