"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin, DollarSign, ArrowRight,
} from "lucide-react";
import {
  Button, Badge, Card,
  GlobalNavbar
} from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { mockApplications } from "@/data";
import type { ApplicationItem } from "@/types/application";

function ApplicationsContent() {
  const { user, logout } = useAuth();

  const getStatusBadge = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "INTERVIEW_SCHEDULED":
        return <Badge variant="verified">Interview Scheduled</Badge>;
      case "IN_REVIEW":
        return <Badge variant="primary">Under Review</Badge>;
      case "OFFER_EXTENDED":
        return <Badge variant="verified">Offer Extended</Badge>;
      default:
        return <Badge variant="default">Submitted</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="opportunities" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                My Applications
              </h1>
              <Badge variant="primary">{mockApplications.length} ACTIVE</Badge>
            </div>
            <p className="text-sm sm:text-base text-[#6E6678] font-sans">
              Track the real-time status of your evidence-matched opportunity submissions.
            </p>
          </div>

          <Link href="/jobs">
            <Button size="sm" variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Explore More Roles
            </Button>
          </Link>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {mockApplications.map((app) => (
            <Card
              key={app.id}
              className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 bg-white hover:border-[#1E5BFF]/50 transition-all shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl font-bold text-[#17131F]">{app.jobTitle}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#6E6678] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-[#1E5BFF]" /> {app.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" /> {app.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-[#2E8F79]" /> {app.salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start">
                  <div className="p-3 bg-[#EEF3FF] border border-[#1E5BFF]/15 rounded-2xl text-center">
                    <p className="font-display text-lg font-bold text-[#1E5BFF]">{app.matchScore}%</p>
                    <p className="text-[10px] font-mono text-[#6E6678] uppercase">Proof Fit</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#D9CEDF]/60 text-xs font-mono text-[#6E6678]">
                <span>Submitted on {app.appliedDate}</span>
                <span className="text-[#1E5BFF] font-semibold">Verified Candidate Package Attached</span>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ApplicationsContent />
    </AuthGuard>
  );
}
