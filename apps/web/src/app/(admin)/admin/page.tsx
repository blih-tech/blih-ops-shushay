"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Building2,
  ChevronRight,
  Plus,
  Briefcase,
  FileText,
  CreditCard,
  Award,
  Bell,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button, Card, Badge, Alert, Skeleton } from "@blih/ui";
import { fetchAdminStats } from "@/lib/adminApi";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminStats } from "@/types/admin";

interface StatCardProps {
  label: string;
  value?: number | string;
  subtext: string;
  loading: boolean;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  delta?: number;
}

function StatCard({ label, value, subtext, loading, icon, bgColor, textColor, delta }: StatCardProps) {
  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#6E6678] uppercase">{label}</span>
        <div className={`w-8 h-8 rounded-xl ${bgColor} ${textColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {loading ? (
        <Skeleton variant="rectangular" className="h-8 w-16 rounded" />
      ) : (
        <p className="font-display text-3xl font-bold text-[#17131F]">{value ?? 0}</p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#6E6678]">{subtext}</p>
        {delta !== undefined && delta > 0 && (
          <span className="text-xs font-mono text-[#2E8F79] font-medium">+{delta} this week</span>
        )}
      </div>
    </div>
  );
}

interface NavTileProps {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  footerText: string;
  footerColor: string;
}

function NavTile({ href, icon, iconBg, iconColor, title, description, footerText, footerColor }: NavTileProps) {
  return (
    <Link href={href} className="block group">
      <Card className="rounded-3xl border border-[#D9CEDF] p-6 hover:border-[#1E5BFF]/60 hover:shadow-lg transition-all h-full bg-white flex flex-col justify-between">
        <div className="space-y-3">
          <div className={`w-10 h-10 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shadow-xs`}>
            {icon}
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[#17131F] group-hover:text-[#1E5BFF] transition-colors flex items-center gap-1.5">
              {title}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#6E6678] font-sans mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className={`pt-4 border-t border-[#D9CEDF]/70 flex items-center justify-between text-xs font-mono ${footerColor} font-semibold mt-4`}>
          <span>{footerText}</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#6E6678] group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}

function AdminContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load platform statistics");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Administration Hub
            </h1>
            <Badge variant="primary">ADMIN PORTAL</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Complete platform management for the Blih ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/courses/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Course
            </Button>
          </Link>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Platform Statistics — Row 1 */}
      <div className="space-y-3">
        <h2 className="font-mono text-xs text-[#6E6678] uppercase tracking-wide">Platform Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers}
            subtext="All registered accounts"
            loading={loading}
            delta={stats?.recentUsersCount}
            icon={<Users className="h-4 w-4" />}
            bgColor="bg-[#EEF3FF]"
            textColor="text-[#1E5BFF]"
          />
          <StatCard
            label="Talents"
            value={stats?.totalTalents}
            subtext="Candidate profiles"
            loading={loading}
            icon={<UserCheck className="h-4 w-4" />}
            bgColor="bg-[#E6F5F0]"
            textColor="text-[#2E8F79]"
          />
          <StatCard
            label="Companies"
            value={stats?.totalCompanies}
            subtext="Hiring organizations"
            loading={loading}
            icon={<Building2 className="h-4 w-4" />}
            bgColor="bg-[#FFF4EE]"
            textColor="text-[#FF8A5B]"
          />
          <StatCard
            label="Active Subs"
            value={stats?.activeSubscriptions}
            subtext="Company subscriptions"
            loading={loading}
            icon={<TrendingUp className="h-4 w-4" />}
            bgColor="bg-[#F3F0FF]"
            textColor="text-[#7C3AED]"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Jobs"
            value={stats?.activeJobs}
            subtext={`of ${stats?.totalJobs ?? 0} total`}
            loading={loading}
            delta={stats?.recentJobsCount}
            icon={<Briefcase className="h-4 w-4" />}
            bgColor="bg-[#FFF9EE]"
            textColor="text-[#D97706]"
          />
          <StatCard
            label="Applications"
            value={stats?.totalApplications}
            subtext="Across all jobs"
            loading={loading}
            delta={stats?.recentApplicationsCount}
            icon={<FileText className="h-4 w-4" />}
            bgColor="bg-[#EEF3FF]"
            textColor="text-[#1E5BFF]"
          />
          <StatCard
            label="Certificates"
            value={stats?.totalCertificates}
            subtext="Verified & issued"
            loading={loading}
            icon={<Award className="h-4 w-4" />}
            bgColor="bg-[#E6F5F0]"
            textColor="text-[#2E8F79]"
          />
          <StatCard
            label="Revenue"
            value={stats ? `${stats.totalRevenue.toLocaleString()} ETB` : undefined}
            subtext={`from ${stats?.totalPayments ?? 0} transactions`}
            loading={loading}
            icon={<CreditCard className="h-4 w-4" />}
            bgColor="bg-[#F3F0FF]"
            textColor="text-[#7C3AED]"
          />
        </div>
      </div>

      {/* Management Tiles */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-[#17131F]">Management Workspaces</h2>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavTile
            href="/admin/users"
            icon={<Users className="h-5 w-5" />}
            iconBg="bg-[#EEF3FF]"
            iconColor="text-[#1E5BFF]"
            title="User Management"
            description="Manage all user accounts, roles, and platform access controls."
            footerText={`${stats?.totalUsers ?? 0} Users`}
            footerColor="text-[#1E5BFF]"
          />
          <NavTile
            href="/admin/talents"
            icon={<UserCheck className="h-5 w-5" />}
            iconBg="bg-[#E6F5F0]"
            iconColor="text-[#2E8F79]"
            title="Talent Directory"
            description="Inspect candidate profiles, CVs, skills, and entitlement status."
            footerText={`${stats?.totalTalents ?? 0} Talents`}
            footerColor="text-[#2E8F79]"
          />
          <NavTile
            href="/admin/companies"
            icon={<Building2 className="h-5 w-5" />}
            iconBg="bg-[#FFF4EE]"
            iconColor="text-[#FF8A5B]"
            title="Company Management"
            description="Track companies, subscription status, and job postings."
            footerText={`${stats?.totalCompanies ?? 0} Companies`}
            footerColor="text-[#FF8A5B]"
          />
          <NavTile
            href="/admin/courses"
            icon={<BookOpen className="h-5 w-5" />}
            iconBg="bg-[#EEF3FF]"
            iconColor="text-[#1E5BFF]"
            title="Course Studio"
            description="Author courses, lessons, quizzes, and manage catalog."
            footerText={`${stats?.totalCourses ?? 0} Courses`}
            footerColor="text-[#1E5BFF]"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavTile
            href="/admin/jobs"
            icon={<Briefcase className="h-5 w-5" />}
            iconBg="bg-[#FFF9EE]"
            iconColor="text-[#D97706]"
            title="Job Management"
            description="Monitor all job postings, statuses, and manage deadlines."
            footerText={`${stats?.activeJobs ?? 0} Active`}
            footerColor="text-[#D97706]"
          />
          <NavTile
            href="/admin/applications"
            icon={<FileText className="h-5 w-5" />}
            iconBg="bg-[#EEF3FF]"
            iconColor="text-[#1E5BFF]"
            title="Applications"
            description="View all candidate job applications and their statuses."
            footerText={`${stats?.totalApplications ?? 0} Total`}
            footerColor="text-[#1E5BFF]"
          />
          <NavTile
            href="/admin/payments"
            icon={<CreditCard className="h-5 w-5" />}
            iconBg="bg-[#F3F0FF]"
            iconColor="text-[#7C3AED]"
            title="Payments"
            description="Monitor Chapa payment transactions, statuses, and revenue."
            footerText="View Transactions"
            footerColor="text-[#7C3AED]"
          />
          <NavTile
            href="/admin/subscriptions"
            icon={<TrendingUp className="h-5 w-5" />}
            iconBg="bg-[#E6F5F0]"
            iconColor="text-[#2E8F79]"
            title="Subscriptions"
            description="Track company subscription plans, expiry, and billing."
            footerText={`${stats?.activeSubscriptions ?? 0} Active`}
            footerColor="text-[#2E8F79]"
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavTile
            href="/admin/certificates"
            icon={<Award className="h-5 w-5" />}
            iconBg="bg-[#E6F5F0]"
            iconColor="text-[#2E8F79]"
            title="Certificates"
            description="All verified course completion certificates issued on the platform."
            footerText={`${stats?.totalCertificates ?? 0} Issued`}
            footerColor="text-[#2E8F79]"
          />
          <NavTile
            href="/admin/notifications"
            icon={<Bell className="h-5 w-5" />}
            iconBg="bg-[#FFF4EE]"
            iconColor="text-[#FF8A5B]"
            title="Notification Logs"
            description="Platform notification activity log and delivery status."
            footerText="View Logs"
            footerColor="text-[#FF8A5B]"
          />
        </div>
      </div>

      {/* Recent Activity */}
      {!loading && (stats?.recentUsers?.length || stats?.recentJobs?.length) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          {stats.recentUsers.length > 0 && (
            <Card className="rounded-3xl border border-[#D9CEDF] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#17131F]">Recent Registrations</h3>
                <Link href="/admin/users" className="text-xs font-mono text-[#1E5BFF] hover:underline">
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-[#D9CEDF]/50">
                {stats.recentUsers.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-xs font-bold shrink-0">
                        {(u.talentProfile?.fullName || u.companyProfile?.companyName || u.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#17131F] truncate">
                          {u.talentProfile?.fullName || u.companyProfile?.companyName || u.email.split("@")[0]}
                        </p>
                        <p className="text-xs text-[#6E6678] truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <AdminStatusBadge type="role" value={u.role} size="sm" />
                      <span className="text-xs font-mono text-[#6E6678]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Jobs */}
          {stats.recentJobs.length > 0 && (
            <Card className="rounded-3xl border border-[#D9CEDF] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#17131F]">Recent Job Postings</h3>
                <Link href="/admin/jobs" className="text-xs font-mono text-[#1E5BFF] hover:underline">
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-[#D9CEDF]/50">
                {stats.recentJobs.map((j) => (
                  <div key={j.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#17131F] truncate">{j.title}</p>
                      <p className="text-xs text-[#6E6678] truncate">
                        {j.companyProfile.companyName || "Unknown Company"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <AdminStatusBadge type="job" value={j.status} size="sm" />
                      <span className="text-xs font-mono text-[#6E6678]">
                        {j._count.applications} apps
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminContent />
    </AuthGuard>
  );
}
