"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  Globe,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Alert, Badge, MetricCard } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminJobById } from "@/lib/adminApi";
import type { AdminJobDetail } from "@/types/admin";

function AdminJobDetailContent() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<AdminJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJobById(jobId);
        setJob(data);
      } catch (err: any) {
        setError(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb items={[{ label: "Jobs", href: "/admin/jobs" }, { label: "Loading..." }]} />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminBreadcrumb items={[{ label: "Jobs", href: "/admin/jobs" }, { label: "Error" }]} />
        <Alert variant="error" className="mt-6">{error || "Job not found"}</Alert>
      </main>
    );
  }

  const formatType = (t: string) =>
    t.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const salaryDisplay =
    job.salaryDisplay ||
    (job.salaryMin
      ? `${job.salaryCurrency} ${job.salaryMin}${job.salaryMax ? `–${job.salaryMax}` : "+"}`
      : "Not disclosed");

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      <AdminBreadcrumb items={[{ label: "Jobs", href: "/admin/jobs" }, { label: job.title }]} />

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard value={job.applications.length} label="Applications" variant="primary" />
        <MetricCard value={formatType(job.experienceLevel)} label="Experience" variant="surface" />
        <MetricCard
          value={job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "None"}
          label="Deadline"
          variant="surface"
        />
        <MetricCard value={salaryDisplay} label="Salary" variant="surface" />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {job.title}
                  </h1>
                  <AdminStatusBadge type="job" value={job.status} />
                </div>
                {/* Inline data chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Building2 className="h-3 w-3 shrink-0" />
                    {job.companyProfile.companyName || "Unknown Company"}
                  </span>
                  {job.companyProfile.city && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {job.companyProfile.city}{job.companyProfile.country ? `, ${job.companyProfile.country}` : ""}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    {formatType(job.employmentType)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body — two column layout */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8 divide-y divide-[#EBE5F0]">
              {/* Description */}
              <div className="space-y-3">
                <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                  Job Description
                </h2>
                <p className="text-sm text-[#6E6678] whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Required Skills */}
              {job.requiredSkills.length > 0 && (
                <div className="pt-8 space-y-3">
                  <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              <div className="pt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Applications
                  </h2>
                  <Badge variant="primary">{job.applications.length}</Badge>
                </div>

                {job.applications.length === 0 ? (
                  <p className="text-sm text-[#6E6678]">No applications yet.</p>
                ) : (
                  <div className="divide-y divide-[#EBE5F0]">
                    {job.applications.map((app) => (
                      <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                            {app.talentProfile.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={app.talentProfile.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (app.talentProfile.fullName || app.talentProfile.user.email).charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-[#17131F] truncate">
                              {app.talentProfile.fullName || app.talentProfile.user.email}
                            </p>
                            <p className="text-xs text-[#6E6678] truncate">{app.talentProfile.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <AdminStatusBadge type="application" value={app.status} size="sm" />
                          <span className="text-xs font-mono text-[#6E6678]">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="space-y-3">
                <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                  Company
                </h2>
                <div className="space-y-2 text-sm text-[#6E6678]">
                  <p className="font-medium text-[#17131F]">
                    {job.companyProfile.companyName || "Unknown"}
                  </p>
                  <p>{job.companyProfile.user.email}</p>
                  {job.companyProfile.country && (
                    <p className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {job.companyProfile.city ? `${job.companyProfile.city}, ` : ""}
                      {job.companyProfile.country}
                    </p>
                  )}
                  {job.companyProfile.companySubscription && (
                    <div className="pt-2 border-t border-[#EBE5F0]">
                      <p className="text-xs font-mono text-[#6E6678] uppercase mb-1.5">Subscription</p>
                      <div className="flex items-center gap-2">
                        <AdminStatusBadge
                          type="subscription"
                          value={job.companyProfile.companySubscription.status}
                          size="sm"
                        />
                        <span className="text-xs text-[#6E6678]">
                          {job.companyProfile.companySubscription.plan}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6678] mt-1">
                        Expires: {new Date(job.companyProfile.companySubscription.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <Link href={`/admin/companies/${job.companyProfile.id}`}>
                  <span className="text-xs text-[#1E5BFF] hover:underline cursor-pointer">
                    View Company →
                  </span>
                </Link>
              </div>

              {/* Country Restrictions */}
              {job.countryRestrictions.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-[#EBE5F0]">
                  <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                    Country Restrictions
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {job.countryRestrictions.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-lg bg-[#F9F8FC] border border-[#D9CEDF] text-xs text-[#6E6678] font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminJobDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminJobDetailContent />
    </AuthGuard>
  );
}
