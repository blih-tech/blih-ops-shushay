"use client";

import React, { useState, useMemo } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Badge, UniversalSearch, Chip, Alert, EmptyState } from "@blih/ui";
import { MapPin, DollarSign, Sparkles, Building2 } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { Job } from "@/types/job";
import { JobPreviewDetail } from "@/components/jobs/JobPreviewDetail";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";

function formatSalary(job: Job): string {
  if (job.salaryDisplay) return job.salaryDisplay;
  if (job.salaryMin && job.salaryMax) {
    return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.salaryCurrency}`;
  }
  if (job.salaryMin) {
    return `From $${job.salaryMin.toLocaleString()} ${job.salaryCurrency}`;
  }
  return "Competitive";
}

function formatLocation(job: Job): string {
  const parts: string[] = [];
  if (job.companyProfile?.city) parts.push(job.companyProfile.city);
  if (job.companyProfile?.country) parts.push(job.companyProfile.country);
  if (parts.length > 0) return parts.join(", ");
  if (job.timezone) return job.timezone;
  return "Remote";
}

function JobsFeedContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Opportunities");
  const { jobs, loading, error, setFilters } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const filterChips = [
    "All Opportunities",
    "Full Time",
    "Part Time",
    "Contract",
    "Senior",
    "Mid Level",
  ];

  const handleFilterClick = (chip: string) => {
    setActiveFilter(chip);
    if (chip === "All Opportunities") {
      setFilters((prev) => ({
        ...prev,
        employmentType: undefined,
        experienceLevel: undefined,
      }));
    } else if (chip === "Full Time") {
      setFilters((prev) => ({
        ...prev,
        employmentType: "FULL_TIME",
        experienceLevel: undefined,
      }));
    } else if (chip === "Part Time") {
      setFilters((prev) => ({
        ...prev,
        employmentType: "PART_TIME",
        experienceLevel: undefined,
      }));
    } else if (chip === "Contract") {
      setFilters((prev) => ({
        ...prev,
        employmentType: "CONTRACT",
        experienceLevel: undefined,
      }));
    } else if (chip === "Senior") {
      setFilters((prev) => ({
        ...prev,
        experienceLevel: "SENIOR",
        employmentType: undefined,
      }));
    } else if (chip === "Mid Level") {
      setFilters((prev) => ({
        ...prev,
        experienceLevel: "MID",
        employmentType: undefined,
      }));
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setFilters((prev) => ({ ...prev, search: q || undefined }));
  };

  const selectedJob = useMemo(() => {
    if (!jobs || jobs.length === 0) return null;
    if (selectedJobId) {
      return jobs.find((j) => j.id === selectedJobId) || jobs[0];
    }
    return jobs[0];
  }, [jobs, selectedJobId]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Opportunity Discovery</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F]">
          Opportunities that know your skills.
        </h1>
        <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
          Find freelance projects, jobs, contracts, internships and challenges
          matched against evidence already in your BLIH OPS profile.
        </p>
      </div>

      {/* Universal Search & Filters */}
      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search roles, companies, or required competencies..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={(q) => handleSearch(q)}
          actionText="Search Roles"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {filterChips.map((chip) => (
            <Chip
              key={chip}
              active={activeFilter === chip}
              onClick={() => handleFilterClick(chip)}
              size="md"
            >
              {chip}
            </Chip>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Error Loading Jobs">
          {error}
        </Alert>
      )}

      {/* Two-Column Master / Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Cards List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <JobCardSkeleton key={i} themeIndex={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={<Building2 className="w-8 h-8 text-[#1E5BFF]" />}
              title="No Opportunities Found"
              description="There are no open positions matching your search criteria right now. Check back soon or try clearing your filters!"
            />
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                const companyName =
                  job.companyProfile?.companyName || "Verified Company";
                const location = formatLocation(job);
                const salary = formatSalary(job);

                const isClosed = job.status === "CLOSED";
                const isExpired =
                  !isClosed &&
                  Boolean(
                    job.applicationDeadline &&
                      new Date(job.applicationDeadline) < new Date()
                  );

                return (
                  <button
                    type="button"
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      // Scroll to detail on mobile viewports
                      if (window.innerWidth < 1024) {
                        document
                          .getElementById("job-detail-panel")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`w-full text-left bg-white border rounded-3xl p-5 sm:p-7 transition-all duration-300 cursor-pointer select-none space-y-4 ${
                      isSelected
                        ? "border-[#1E5BFF] shadow-[0_12px_40px_rgba(30,91,255,0.08)] bg-gradient-to-r from-white to-[#EEF3FF]/40"
                        : "border-[#D9CEDF] hover:border-[#1E5BFF]/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-xs text-[#1E5BFF] font-semibold">
                          {companyName}
                        </span>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-[#17131F] mt-0.5">
                          {job.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {isClosed ? (
                          <Badge variant="outline" size="sm">
                            Closed
                          </Badge>
                        ) : isExpired ? (
                          <Badge variant="amber" size="sm">
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="verified" size="sm">
                            Active
                          </Badge>
                        )}
                        {job.hasApplied && (
                          <Badge variant="verified" size="sm">
                            Applied
                          </Badge>
                        )}
                        <Badge variant="primary" size="md">
                          {job.employmentType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    <p className="font-sans text-sm text-[#6E6678] line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9CEDF]/50 text-xs font-sans text-[#6E6678]">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-[#17131F]">
                          <DollarSign className="w-3.5 h-3.5 text-[#2E8F79]" />
                          {salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" />
                          {location}
                        </span>
                      </div>

                      <span className="font-mono text-[11px] text-[#6E6678]">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detail Panel */}
        <div
          id="job-detail-panel"
          className="lg:col-span-5 sticky top-24 space-y-6"
        >
          <JobPreviewDetail
            job={selectedJob}
            formatSalary={formatSalary}
            formatLocation={formatLocation}
          />
        </div>
      </div>
    </main>
  );
}

export default function JobsPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <JobsFeedContent />
    </AuthGuard>
  );
}
