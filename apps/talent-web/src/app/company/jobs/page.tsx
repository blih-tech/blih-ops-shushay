"use client";

import React, { useState } from "react";
import { Plus, MapPin, DollarSign, Building2 } from "lucide-react";
import { Button, Badge, Card, GlobalNavbar } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";

import { mockCompanyJobs, type CompanyJobItem } from "@/data";

function CompanyJobsContent() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<CompanyJobItem[]>(mockCompanyJobs);

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="company" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                Job Postings & Roles
              </h1>
              <Badge variant="primary">{jobs.length} ACTIVE</Badge>
            </div>
            <p className="text-sm sm:text-base text-[#6E6678] font-sans">
              Publish positions, specify verified skill criteria, and track
              candidate applications.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create New Job Post
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="border border-[#D9CEDF] rounded-3xl p-5 sm:p-8 bg-white hover:border-[#1E5BFF]/50 transition-all shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#17131F]">
                      {job.title}
                    </h3>
                    <Badge variant="verified" size="sm">
                      {job.status}
                    </Badge>
                    <span className="text-xs font-mono text-[#6E6678]">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#6E6678] flex-wrap pt-0.5">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-[#1E5BFF]" />{" "}
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />{" "}
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-[#2E8F79]" />{" "}
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9CEDF]/50">
                  <div className="p-2.5 sm:p-3 bg-[#EEF3FF] border border-[#1E5BFF]/15 rounded-2xl text-center">
                    <p className="font-display text-lg sm:text-xl font-bold text-[#1E5BFF]">
                      {job.applicantsCount}
                    </p>
                    <p className="text-[10px] font-mono text-[#6E6678] uppercase">
                      Applicants
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage Role
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9CEDF]/60">
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill, si) => (
                    <span
                      key={si}
                      className="px-2.5 py-0.5 rounded-lg bg-[#EEF3FF] border border-[#1E5BFF]/15 text-[11px] font-mono text-[#1E5BFF] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-mono text-[#6E6678]">
                  Posted {job.postedDate}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function CompanyJobsPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyJobsContent />
    </AuthGuard>
  );
}
