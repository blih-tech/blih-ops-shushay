"use client";

import React from "react";
import { UniversalSearch, Select } from "@blih/ui";

export const statusFilterOptions = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active Roles" },
  { value: "CLOSED", label: "Closed Roles" },
];

export const employmentTypeOptions = [
  { value: "", label: "All Job Types" },
  { value: "FULL_TIME", label: "Full-Time" },
  { value: "PART_TIME", label: "Part-Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Internship" },
];

interface CompanyJobsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  employmentTypeFilter: string;
  onEmploymentTypeFilterChange: (type: string) => void;
  onClearFilters: () => void;
}

export function CompanyJobsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  employmentTypeFilter,
  onEmploymentTypeFilterChange,
  onClearFilters,
}: CompanyJobsFiltersProps) {
  const hasActiveFilters = Boolean(
    searchQuery || statusFilter || employmentTypeFilter
  );

  return (
    <div className="space-y-2">
      {/* Search Input & Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex-1">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onSearch={(q) => onSearchChange(q)}
            placeholder="Search postings by role title, keyword, or skill..."
            actionText="Search"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <Select
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            placeholder="Filter Status"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <Select
            options={employmentTypeOptions}
            value={employmentTypeFilter}
            onChange={(e) => onEmploymentTypeFilterChange(e.target.value)}
            placeholder="Job Type"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-mono text-[#1E5BFF] hover:underline cursor-pointer"
          >
            Clear active filters
          </button>
        </div>
      )}
    </div>
  );
}
