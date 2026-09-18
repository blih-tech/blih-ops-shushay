"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  CreditCard,
  Award,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Alert, Skeleton } from "@blih/ui";
import { fetchAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin";
import { usePageTitle } from "@/hooks/usePageTitle";

function StatCard({
  label,
  value,
  subtext,
  loading,
  icon: Icon,
  color,
  delta,
}: {
  label: string;
  value?: number | string;
  subtext: string;
  loading: boolean;
  icon: React.ElementType;
  color: string;
  delta?: number;
}) {
  return (
    <div className="bg-white border border-[#EBE5F0] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-mono text-[#9B8FA8] uppercase tracking-wider mb-1">
          {label}
        </p>
        {loading ? (
          <Skeleton variant="rectangular" className="h-7 w-20 rounded" />
        ) : (
          <p className="font-display text-2xl font-bold text-[#17131F] leading-none">
            {value ?? 0}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-[#9B8FA8]">{subtext}</p>
          {delta !== undefined && delta > 0 && (
            <span className="text-xs font-mono text-[#2E8F79] font-medium bg-[#E6F5F0] px-1.5 py-0.5 rounded-md">
              +{delta} this week
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to load statistics"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full px-6 py-6 space-y-8 max-w-screen-2xl">

      {/* Page header */}
      <div className="pb-5 border-b border-[#EBE5F0]">
        <h1 className="font-display text-2xl font-bold text-[#17131F] tracking-tight">
          Platform Overview
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
          Real-time platform health and activity metrics.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers}
          subtext="All registered accounts"
          loading={loading}
          delta={stats?.recentUsersCount}
          icon={Users}
          color="bg-[#EEF3FF] text-[#1E5BFF]"
        />
        <StatCard
          label="Talents"
          value={stats?.totalTalents}
          subtext="Candidate profiles"
          loading={loading}
          icon={UserCheck}
          color="bg-[#E6F5F0] text-[#2E8F79]"
        />
        <StatCard
          label="Companies"
          value={stats?.totalCompanies}
          subtext="Hiring organisations"
          loading={loading}
          icon={Building2}
          color="bg-[#FFF4EE] text-[#FF8A5B]"
        />
        <StatCard
          label="Active Subscriptions"
          value={stats?.activeSubscriptions}
          subtext="Live company plans"
          loading={loading}
          icon={TrendingUp}
          color="bg-[#F3F0FF] text-[#7C3AED]"
        />
        <StatCard
          label="Active Jobs"
          value={stats?.activeJobs}
          subtext={`of ${stats?.totalJobs ?? 0} total`}
          loading={loading}
          delta={stats?.recentJobsCount}
          icon={Briefcase}
          color="bg-[#FFF9EE] text-[#D97706]"
        />
        <StatCard
          label="Applications"
          value={stats?.totalApplications}
          subtext="Across all jobs"
          loading={loading}
          delta={stats?.recentApplicationsCount}
          icon={FileText}
          color="bg-[#EEF3FF] text-[#1E5BFF]"
        />
        <StatCard
          label="Certificates"
          value={stats?.totalCertificates}
          subtext="Verified & issued"
          loading={loading}
          icon={Award}
          color="bg-[#E6F5F0] text-[#2E8F79]"
        />
        <StatCard
          label="Revenue"
          value={stats ? `${stats.totalRevenue.toLocaleString()} ETB` : undefined}
          subtext={`from ${stats?.totalPayments ?? 0} transactions`}
          loading={loading}
          icon={CreditCard}
          color="bg-[#F3F0FF] text-[#7C3AED]"
        />
      </div>

      {/* Activity tables */}
      {!loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Registrations */}
          {!!stats?.recentUsers?.length && (
            <div className="bg-white border border-[#EBE5F0] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE5F0]">
                <h2 className="font-display font-bold text-base text-[#17131F]">
                  Recent Registrations
                </h2>
                <Link
                  href="/admin/users"
                  className="text-xs font-mono text-[#1E5BFF] hover:underline"
                >
                  View All →
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9F8FC]">
                    <th className="text-left px-6 py-3 text-xs font-mono text-[#9B8FA8] uppercase tracking-wider font-medium">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-mono text-[#9B8FA8] uppercase tracking-wider font-medium">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-mono text-[#9B8FA8] uppercase tracking-wider font-medium">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1F8]">
                  {stats.recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F9F8FC] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-xs font-bold shrink-0">
                            {(
                              u.talentProfile?.fullName ||
                              u.companyProfile?.companyName ||
                              u.email
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/users/${u.id}`}
                              className="font-medium text-[#17131F] truncate hover:text-[#1E5BFF] transition-colors block"
                            >
                              {u.talentProfile?.fullName ||
                                u.companyProfile?.companyName ||
                                u.email.split("@")[0]}
                            </Link>
                            <p className="text-xs text-[#9B8FA8] truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge type="role" value={u.role} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[#9B8FA8] whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Job Postings */}
          {!!stats?.recentJobs?.length && (
            <div className="bg-white border border-[#EBE5F0] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE5F0]">
                <h2 className="font-display font-bold text-base text-[#17131F]">
                  Recent Job Postings
                </h2>
                <Link
                  href="/admin/jobs"
                  className="text-xs font-mono text-[#1E5BFF] hover:underline"
                >
                  View All →
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9F8FC]">
                    <th className="text-left px-6 py-3 text-xs font-mono text-[#9B8FA8] uppercase tracking-wider font-medium">
                      Job
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-mono text-[#9B8FA8] uppercase tracking-wider font-medium">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-mono text-[#9B8FA8] uppercase tracking-wider font-medium">
                      Apps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1F8]">
                  {stats.recentJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-[#F9F8FC] transition-colors">
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/jobs/${j.id}`}
                          className="font-medium text-[#17131F] truncate hover:text-[#1E5BFF] transition-colors block max-w-[200px]"
                        >
                          {j.title}
                        </Link>
                        <p className="text-xs text-[#9B8FA8] truncate max-w-[200px]">
                          {j.companyProfile.companyName || "Unknown Company"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge type="job" value={j.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[#9B8FA8]">
                        {j._count.applications}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  usePageTitle("Dashboard | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminContent />
    </AuthGuard>
  );
}
