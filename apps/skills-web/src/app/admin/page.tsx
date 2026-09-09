"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Building2,
  ChevronRight,
  Plus,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, Card, Badge, Alert, Skeleton } from "@blih/ui";
import { fetchAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin";

interface StatCardProps {
  label: string;
  value?: number | string;
  subtext: string;
  loading: boolean;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

function StatCard({ label, value, subtext, loading, icon, bgColor, textColor }: StatCardProps) {
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
      <p className="text-xs text-[#6E6678]">{subtext}</p>
    </div>
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
            Oversee course curriculum, verify candidate evidence profiles, and
            manage hiring company authorizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/courses/new">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create New Course
            </Button>
          </Link>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Live Platform Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Talents"
          value={stats?.totalTalents}
          subtext="Registered candidates"
          loading={loading}
          icon={<Users className="h-4 w-4" />}
          bgColor="bg-[#EEF3FF]"
          textColor="text-[#1E5BFF]"
        />
        <StatCard
          label="Companies"
          value={stats?.totalCompanies}
          subtext="Hiring organizations"
          loading={loading}
          icon={<Building2 className="h-4 w-4" />}
          bgColor="bg-[#E6F5F0]"
          textColor="text-[#2E8F79]"
        />
        <StatCard
          label="Courses"
          value={stats?.totalCourses}
          subtext={`${stats?.publishedCourses ?? 0} published catalog`}
          loading={loading}
          icon={<BookOpen className="h-4 w-4" />}
          bgColor="bg-[#FFF4EE]"
          textColor="text-[#FF8A5B]"
        />
        <StatCard
          label="Modules"
          value={stats?.totalLessons}
          subtext="Total lesson lectures"
          loading={loading}
          icon={<Layers className="h-4 w-4" />}
          bgColor="bg-[#FFF9EE]"
          textColor="text-[#D97706]"
        />
      </div>

      {/* 3 Major Management Gateways */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#17131F]">
          Operational Management Workspaces
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Course Studio */}
          <Link href="/admin/courses" className="block group">
            <Card className="rounded-3xl border border-[#D9CEDF] p-8 hover:border-[#1E5BFF]/60 hover:shadow-lg transition-all h-full bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shadow-xs">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[#17131F] group-hover:text-[#1E5BFF] transition-colors flex items-center gap-2">
                    Course Curriculum Studio
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-[#6E6678] font-sans mt-1.5 leading-relaxed">
                    Author courses, structure lesson modules, upload high-def
                    video lectures, and build interactive quizzes.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#D9CEDF]/70 flex items-center justify-between text-xs font-mono text-[#1E5BFF] font-semibold mt-4">
                <span>Manage Catalog ({stats?.totalCourses ?? 0})</span>
                <ChevronRight className="h-4 w-4 text-[#6E6678] group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* 2. Talent Directory */}
          <Link href="/admin/talents" className="block group">
            <Card className="rounded-3xl border border-[#D9CEDF] p-8 hover:border-[#1E5BFF]/60 hover:shadow-lg transition-all h-full bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center shadow-xs">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[#17131F] group-hover:text-[#2E8F79] transition-colors flex items-center gap-2">
                    Talent Directory & Profiles
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-[#6E6678] font-sans mt-1.5 leading-relaxed">
                    Inspect candidate records, download CV attachments, review
                    verified skills, and monitor talent onboarding.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#D9CEDF]/70 flex items-center justify-between text-xs font-mono text-[#2E8F79] font-semibold mt-4">
                <span>Browse Candidates ({stats?.totalTalents ?? 0})</span>
                <ChevronRight className="h-4 w-4 text-[#6E6678] group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* 3. Company Directory */}
          <Link href="/admin/companies" className="block group">
            <Card className="rounded-3xl border border-[#D9CEDF] p-8 hover:border-[#1E5BFF]/60 hover:shadow-lg transition-all h-full bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF4EE] text-[#FF8A5B] flex items-center justify-center shadow-xs">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[#17131F] group-hover:text-[#FF8A5B] transition-colors flex items-center gap-2">
                    Company Management
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-[#6E6678] font-sans mt-1.5 leading-relaxed">
                    Track registered hiring organizations, contact details,
                    company profiles, and subscription plans.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#D9CEDF]/70 flex items-center justify-between text-xs font-mono text-[#FF8A5B] font-semibold mt-4">
                <span>View Companies ({stats?.totalCompanies ?? 0})</span>
                <ChevronRight className="h-4 w-4 text-[#6E6678] group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
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
