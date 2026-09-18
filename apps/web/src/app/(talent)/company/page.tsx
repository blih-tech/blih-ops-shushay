"use client";

import React from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  Badge,
  MetricCard,
} from "@blih/ui";
import {
  Briefcase,
  CreditCard,
  ArrowRight,
  Users,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react";

import { listCompanyJobs } from "@/lib/jobApi";
import { getCompanySubscriptionStatus } from "@blih/api-client";
import { Job } from "@/types/job";

function CompanyDashboardContent() {
  const { user } = useAuth();
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);
  const [recentJobs, setRecentJobs] = React.useState<Job[]>([]);
  const [metrics, setMetrics] = React.useState({
    activeJobsCount: 0,
    totalApplications: 0,
    subscriptionPlan: "Free Tier",
    subscriptionActive: false,
  });

  React.useEffect(() => {
    async function loadDashboardMetrics() {
      setLoadingMetrics(true);
      try {
        const [jobsRes, subRes] = await Promise.allSettled([
          listCompanyJobs(),
          getCompanySubscriptionStatus(),
        ]);

        let activeJobsCount = 0;
        let totalApplications = 0;

        if (jobsRes.status === "fulfilled" && jobsRes.value?.jobs) {
          const allJobs = jobsRes.value.jobs;
          setRecentJobs(allJobs.slice(0, 4));

          activeJobsCount = allJobs.filter((j: any) => {
            if (j.status !== "ACTIVE") return false;
            if (
              j.applicationDeadline &&
              new Date(j.applicationDeadline) < new Date()
            ) {
              return false;
            }
            return true;
          }).length;
          totalApplications = allJobs.reduce(
            (sum: number, j: any) => sum + (j._count?.applications || 0),
            0
          );
        }

        let subscriptionPlan = "Free Tier";
        let subscriptionActive = false;

        if (subRes.status === "fulfilled" && subRes.value) {
          subscriptionActive = subRes.value.hasActiveSubscription;
          if (subRes.value.subscription) {
            subscriptionPlan =
              subRes.value.subscription.plan === "YEARLY"
                ? "Annual Plan"
                : "Monthly Plan";
          } else if (subRes.value.hasActiveSubscription) {
            subscriptionPlan = "Active Plan";
          }
        }

        setMetrics({
          activeJobsCount,
          totalApplications,
          subscriptionPlan,
          subscriptionActive,
        });
      } catch (err) {
        console.error("Failed to fetch company metrics:", err);
      } finally {
        setLoadingMetrics(false);
      }
    }

    loadDashboardMetrics();
  }, []);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF]/80 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Company Dashboard
            </h1>
            <Badge variant="primary">DASHBOARD</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Welcome back,{" "}
            <strong className="text-[#17131F]">{user?.email}</strong>. Real-time overview of your recruitment pipeline, active postings, and talent engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/company/jobs">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          value={loadingMetrics ? "..." : String(metrics.activeJobsCount)}
          label="Active Job Postings"
          variant="surface"
        />
        <MetricCard
          value={loadingMetrics ? "..." : String(metrics.totalApplications)}
          label="Candidate Applications"
          variant="primary"
        />
        <MetricCard
          value="Verified"
          label="Capability Match Engine"
          variant="surface"
        />
        <MetricCard
          value={
            loadingMetrics
              ? "..."
              : metrics.subscriptionActive
              ? metrics.subscriptionPlan
              : "Inactive"
          }
          label="Subscription Status"
          variant="surface"
        />
      </div>

      {/* Recent Job Postings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#17131F] font-display">
              Recent Role Postings
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6678]">
              Monitor applicant influx and manage recently listed positions.
            </p>
          </div>
          <Link
            href="/company/jobs"
            className="text-xs sm:text-sm font-semibold text-[#1E5BFF] hover:underline flex items-center gap-1"
          >
            View all postings
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingMetrics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-28 rounded-2xl bg-slate-100/80 animate-pulse border border-[#D9CEDF]/50"
              />
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="bg-[#FAF8FC] border border-[#D9CEDF]/70 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#17131F]">No job postings yet</h3>
            <p className="text-sm text-[#6E6678] max-w-md mx-auto">
              Start finding vetted candidates by publishing your first open role.
            </p>
            <div className="pt-2">
              <Link href="/company/jobs">
                <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Create Job Posting
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map((job) => {
              const isClosed = job.status === "CLOSED";
              const isExpired =
                job.applicationDeadline &&
                new Date(job.applicationDeadline) < new Date();
              const appCount = job._count?.applications ?? 0;

              return (
                <div
                  key={job.id}
                  className="bg-white border border-[#D9CEDF]/80 rounded-2xl p-5 hover:border-[#1E5BFF]/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-[#17131F] line-clamp-1 text-base">
                        {job.title}
                      </h4>
                      <Badge variant={isClosed || isExpired ? "outline" : "primary"}>
                        {isClosed ? "CLOSED" : isExpired ? "EXPIRED" : "ACTIVE"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
                      <span className="capitalize">{job.employmentType.replace("_", " ").toLowerCase()}</span>
                      <span>•</span>
                      <span className="capitalize">{job.experienceLevel.toLowerCase()} Level</span>
                      {job.applicationDeadline && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#6E6678]" />
                            {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#D9CEDF]/50">
                    <div className="text-xs text-[#6E6678]">
                      <span className="font-bold text-[#17131F] text-sm">{appCount}</span>{" "}
                      {appCount === 1 ? "applicant" : "applicants"}
                    </div>
                    <Link href={`/company/jobs/${job.id}`}>
                      <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Review Candidates
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#17131F] font-display">
            Quick Navigation & Management
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6678]">
            Direct shortcuts to manage candidate pipelines and published roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="interactive" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl mb-1">Job Postings</CardTitle>
              <CardDescription className="text-sm">
                Post open engineering & product roles, view candidate score thresholds, and reopen listings.
              </CardDescription>
            </div>
            <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4">
              <Link href="/company/jobs" className="w-full block">
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Manage Jobs
                </Button>
              </Link>
            </div>
          </Card>

          <Card variant="interactive" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] mb-4">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl mb-1">Talent Discovery</CardTitle>
              <CardDescription className="text-sm">
                Search verified graduate portfolios, code challenge benchmarks, and assess skills.
              </CardDescription>
            </div>
            <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4">
              <Link href="/company/talents" className="w-full block">
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Search Talents
                </Button>
              </Link>
            </div>
          </Card>

          <Card variant="interactive" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl mb-1">Billing & Access</CardTitle>
              <CardDescription className="text-sm">
                Manage hiring seat licenses, payment methods, renewal terms, and receipt records.
              </CardDescription>
            </div>
            <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4">
              <Link href="/company/subscription" className="w-full block">
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function CompanyDashboardPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyDashboardContent />
    </AuthGuard>
  );
}
