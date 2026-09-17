"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { Button, Badge, Card, Skeleton, Alert, EmptyState } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useCompanyJobs } from "@/hooks/useCompanyJobs";
import { CompanyJobCard } from "@/components/company/CompanyJobCard";
import { CompanyJobsTable } from "@/components/company/CompanyJobsTable";
import { CompanyJobsFilters } from "@/components/company/CompanyJobsFilters";
import { CompanyJobsModals } from "@/components/company/CompanyJobsModals";
import { ViewModeToggle, type ViewMode } from "@/components/ui/ViewModeToggle";

function CompanyJobsContent() {
  const { jobs, loading, error, closeJob, reopenJob, setFilters } =
    useCompanyJobs();
  const [jobToClose, setJobToClose] = useState<string | null>(null);
  const [jobToReopen, setJobToReopen] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "blih_company_jobs_view_mode"
      ) as ViewMode;
      if (saved === "cards" || saved === "table") {
        setViewMode(saved);
      }
    } catch (e) {}
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("blih_company_jobs_view_mode", mode);
    } catch (e) {}
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setFilters((prev) => ({ ...prev, search: q || undefined }));
  };

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setFilters((prev) => ({
      ...prev,
      status: (val as any) || undefined,
    }));
  };

  const handleEmploymentTypeFilter = (val: string) => {
    setEmploymentTypeFilter(val);
    setFilters((prev) => ({
      ...prev,
      employmentType: (val as any) || undefined,
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setEmploymentTypeFilter("");
    setFilters({});
  };

  const handleConfirmClose = async () => {
    if (!jobToClose) return;
    setIsClosing(true);
    setActionError(null);
    try {
      await closeJob(jobToClose);
      setJobToClose(null);
    } catch (err: any) {
      setActionError(err?.message || "Failed to close job posting.");
    } finally {
      setIsClosing(false);
    }
  };

  const handleConfirmReopen = async () => {
    if (!jobToReopen) return;
    setIsReopening(true);
    setActionError(null);
    try {
      await reopenJob(jobToReopen);
      setJobToReopen(null);
    } catch (err: any) {
      setActionError(err?.message || "Failed to reopen job posting.");
    } finally {
      setIsReopening(false);
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery || statusFilter || employmentTypeFilter
  );

  const activeJobsCount = jobs.filter((j) => {
    if (j.status !== "ACTIVE") return false;
    if (
      j.applicationDeadline &&
      new Date(j.applicationDeadline) < new Date()
    ) {
      return false;
    }
    return true;
  }).length;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Job Postings & Roles
            </h1>
            <Badge variant="primary">{activeJobsCount} ACTIVE</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Publish positions, specify verified skill criteria, and review
            candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />
          <Link href="/company/jobs/new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create New Job Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <CompanyJobsFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilter}
        employmentTypeFilter={employmentTypeFilter}
        onEmploymentTypeFilterChange={handleEmploymentTypeFilter}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <Alert variant="error" title="Error Loading Jobs">
          {error}
        </Alert>
      )}

      {actionError && (
        <Alert variant="error" title="Could Not Update Role">
          {actionError}
        </Alert>
      )}

      {/* Jobs List / Table */}
      {loading ? (
        viewMode === "table" ? (
          <CompanyJobsTable
            jobs={[]}
            loading={true}
            onCloseJob={() => {}}
            onReopenJob={() => {}}
          />
        ) : (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Card
                key={i}
                className="border border-[#D9CEDF] rounded-3xl p-6 bg-white space-y-4"
              >
                <Skeleton
                  variant="rectangular"
                  width={220}
                  height={24}
                  className="rounded-md"
                />
                <Skeleton variant="text" className="w-3/4" />
                <div className="flex gap-4">
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={16}
                    className="rounded-md"
                  />
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={16}
                    className="rounded-md"
                  />
                </div>
              </Card>
            ))}
          </div>
        )
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8 text-[#1E5BFF]" />}
          title="No Job Postings Found"
          description={
            hasActiveFilters
              ? "No job postings match your active search or filters. Try adjusting your search query or clearing filters."
              : "Create your first job listing to start receiving applications from verified candidates."
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Active Filters
              </Button>
            ) : (
              <Link href="/company/jobs/new">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Create First Job
                </Button>
              </Link>
            )
          }
        />
      ) : viewMode === "table" ? (
        <CompanyJobsTable
          jobs={jobs}
          closingId={isClosing ? jobToClose : null}
          reopeningId={isReopening ? jobToReopen : null}
          onCloseJob={(id) => {
            setActionError(null);
            setJobToClose(id);
          }}
          onReopenJob={(id) => {
            setActionError(null);
            setJobToReopen(id);
          }}
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <CompanyJobCard
              key={job.id}
              job={job}
              closingId={isClosing ? jobToClose : null}
              reopeningId={isReopening ? jobToReopen : null}
              onCloseJob={(id) => {
                setActionError(null);
                setJobToClose(id);
              }}
              onReopenJob={(id) => {
                setActionError(null);
                setJobToReopen(id);
              }}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modals */}
      <CompanyJobsModals
        jobToClose={jobToClose}
        isClosing={isClosing}
        onCloseCancel={() => {
          if (!isClosing) {
            setJobToClose(null);
            setActionError(null);
          }
        }}
        onCloseConfirm={handleConfirmClose}
        jobToReopen={jobToReopen}
        isReopening={isReopening}
        onReopenCancel={() => {
          if (!isReopening) {
            setJobToReopen(null);
            setActionError(null);
          }
        }}
        onReopenConfirm={handleConfirmReopen}
      />
    </main>
  );
}

export default function CompanyJobsPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyJobsContent />
    </AuthGuard>
  );
}
