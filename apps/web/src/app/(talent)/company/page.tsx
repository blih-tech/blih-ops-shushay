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
  Building,
  ArrowRight,
  Users,
} from "lucide-react";

import { listCompanyJobs } from "@/lib/jobApi";
import { getCompanySubscriptionStatus } from "@blih/api-client";

function CompanyDashboardContent() {
  const { user } = useAuth();
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);
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
          activeJobsCount = jobsRes.value.jobs.filter((j) => {
            if (j.status !== "ACTIVE") return false;
            if (
              j.applicationDeadline &&
              new Date(j.applicationDeadline) < new Date()
            ) {
              return false;
            }
            return true;
          }).length;
          totalApplications = jobsRes.value.jobs.reduce(
            (sum, j) => sum + (j._count?.applications || 0),
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
              Company Hiring Portal
            </h1>
            <Badge variant="primary">COMPANY</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Welcome back,{" "}
            <strong className="text-[#17131F]">{user?.email}</strong>. Manage
            candidate screening and live roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/company/profile">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Building className="h-4 w-4" />}
            >
              Organization Profile
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

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="interactive" className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] mb-4">
              <Building className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl mb-1">Company Profile</CardTitle>
            <CardDescription className="text-sm">
              Set up branding, headquarters location, website, and company
              introduction.
            </CardDescription>
          </div>
          <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4">
            <Link href="/company/profile" className="w-full block">
              <Button
                size="sm"
                variant="outline"
                fullWidth
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Manage Profile
              </Button>
            </Link>
          </div>
        </Card>

        <Card variant="interactive" className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl mb-1">Live Job Board</CardTitle>
            <CardDescription className="text-sm">
              Post open engineering & product positions with required score
              thresholds.
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
                Manage Job Posts
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
              Browse verified graduate portfolios, code exercises, and
              assessment scores.
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
              Manage hiring seat licenses, payment methods, and receipt history.
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
