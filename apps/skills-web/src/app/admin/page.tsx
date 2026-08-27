"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Users, Building2, ChevronRight,
  Plus, Layers, ArrowUpRight
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, Card, CardHeader, CardTitle, CardDescription, GlobalNavbar, Badge, Spinner, Alert, Skeleton } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin";

function AdminContent() {
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="admin" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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
              Oversee course curriculum, verify candidate evidence profiles, and manage hiring company authorizations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/courses/new">
              <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                Create New Course
              </Button>
            </Link>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Live Platform Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#6E6678] uppercase">Talents</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            {loading ? (
              <Skeleton variant="rectangular" className="h-8 w-16 rounded" />
            ) : (
              <p className="font-display text-3xl font-bold text-[#17131F]">
                {stats?.totalTalents ?? 0}
              </p>
            )}
            <p className="text-xs text-[#6E6678]">Registered candidates</p>
          </div>

          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#6E6678] uppercase">Companies</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#2E8F79] flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            {loading ? (
              <Skeleton variant="rectangular" className="h-8 w-16 rounded" />
            ) : (
              <p className="font-display text-3xl font-bold text-[#17131F]">
                {stats?.totalCompanies ?? 0}
              </p>
            )}
            <p className="text-xs text-[#6E6678]">Hiring organizations</p>
          </div>

          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#6E6678] uppercase">Courses</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#FF8A5B] flex items-center justify-center">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            {loading ? (
              <Skeleton variant="rectangular" className="h-8 w-16 rounded" />
            ) : (
              <p className="font-display text-3xl font-bold text-[#17131F]">
                {stats?.totalCourses ?? 0}
              </p>
            )}
            <p className="text-xs text-[#6E6678]">{stats?.publishedCourses ?? 0} published catalog</p>
          </div>

          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#6E6678] uppercase">Modules</span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            {loading ? (
              <Skeleton variant="rectangular" className="h-8 w-16 rounded" />
            ) : (
              <p className="font-display text-3xl font-bold text-[#17131F]">
                {stats?.totalLessons ?? 0}
              </p>
            )}
            <p className="text-xs text-[#6E6678]">Total lesson lectures</p>
          </div>
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
                      Author courses, structure lesson modules, upload high-def video lectures, and build interactive quizzes.
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
                      Inspect candidate records, download CV attachments, review verified skills, and monitor talent onboarding.
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
                      Track registered hiring organizations, contact details, company profiles, and subscription plans.
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
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminContent />
    </AuthGuard>
  );
}
