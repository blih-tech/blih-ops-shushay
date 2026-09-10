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
import { Alert, Badge, Button, MetricCard } from "@blih/ui";
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
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb items={[{ label: "Companies", href: "/admin/companies" }, { label: "Loading..." }]} />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb items={[{ label: "Companies", href: "/admin/companies" }, { label: "Error" }]} />
        <Alert variant="error">{error || "Company profile not found"}</Alert>
      </main>
    );
  }

  const sub = company.companySubscription;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <AdminBreadcrumb
        items={[{ label: "Companies", href: "/admin/companies" }, { label: company.companyName }]}
      />

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard value={company.jobs?.length ?? 0} label="Job Postings" variant="primary" />
        <MetricCard value={sub?.plan || "Free"} label="Plan" variant="surface" />
        <MetricCard value={sub?.status || "None"} label="Sub Status" variant="surface" />
        <MetricCard
          value={sub?.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : "N/A"}
          label="Expires"
          variant="surface"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-2xl shrink-0 overflow-hidden">
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  company.companyName?.charAt(0).toUpperCase() || "C"
                )}
              </div>
              <div className="space-y-2">
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
                {/* Inline data chips */}
                <div className="flex flex-wrap gap-2">
                  {company.user?.email && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      <Mail className="h-3 w-3 shrink-0" />
                      {company.user.email}
                    </span>
                  )}
                  {(company.city || company.country) && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {[company.city, company.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#1E5BFF] bg-[#EEF3FF] border border-[#1E5BFF]/15 rounded-xl px-3 py-1.5 hover:underline"
                    >
                      <Globe className="h-3 w-3 shrink-0" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
            {company.user?.id && (
              <Link href={`/admin/users/${company.user.id}`}>
                <Button size="sm" variant="outline">User Account</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="divide-y divide-[#EBE5F0]">

          {/* Description */}
          {company.description && (
            <div className="p-6 sm:p-8 space-y-3">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">Overview</h2>
              <p className="text-sm text-[#6E6678] leading-relaxed whitespace-pre-line">{company.description}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">Contact</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                <span className="text-xs text-[#6E6678] w-36 shrink-0">Contact Email</span>
                <span className="font-medium text-sm text-[#17131F]">{company.contactEmail || "—"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-2">
                <span className="text-xs text-[#6E6678] w-36 shrink-0">Contact Phone</span>
                <span className="font-medium text-sm text-[#17131F]">{company.contactPhone || "—"}</span>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">Subscription</h2>
              {sub?.id && (
                <Link href={`/admin/subscriptions/${sub.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">View Details →</Button>
                </Link>
              )}
            </div>
            {sub ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-36 shrink-0">Plan</span>
                  <span className="font-medium text-sm text-[#17131F]">{sub.plan}</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-36 shrink-0">Status</span>
                  <AdminStatusBadge type="subscription" value={sub.status} />
                </div>
                <div className="flex items-center justify-between gap-4 py-2 border-b border-[#F9F8FC]">
                  <span className="text-xs text-[#6E6678] w-36 shrink-0">Amount</span>
                  <span className="font-medium text-sm text-[#17131F]">{sub.amount} {sub.currency}</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-xs text-[#6E6678] w-36 shrink-0">Expires</span>
                  <span className="font-medium text-sm text-[#17131F]">
                    {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : "Never"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6E6678]">No active paid subscription.</p>
            )}
          </div>

          {/* Job Postings */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5" /> Job Postings ({company.jobs?.length ?? 0})
            </h2>
            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-1">
                {company.jobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between gap-4 py-2.5 border-b border-[#F9F8FC] last:border-0">
                    <div>
                      <p className="font-medium text-[#17131F] text-sm">{job.title}</p>
                      <p className="text-xs text-[#6E6678] font-mono">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <AdminStatusBadge type="job" value={job.status} />
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6E6678]">No job postings recorded.</p>
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
