"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Users } from "lucide-react";
import {
  Button,
  Badge,
  Card,
  UniversalSearch,
  Alert,
  EmptyState,
  Select,
} from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentSearch } from "@/hooks/useTalentSearch";
import { TalentSearchResultItem } from "@/lib/talentApi";
import { TalentCard } from "@/components/company/TalentCard";
import { TalentCardSkeleton } from "@/components/company/TalentCardSkeleton";
import { CompanyTalentsTable } from "@/components/company/CompanyTalentsTable";
import { ViewModeToggle, type ViewMode } from "@/components/ui/ViewModeToggle";

const englishLevelFilterOptions = [
  { value: "", label: "All English Levels" },
  { value: "CONVERSATIONAL", label: "Conversational+" },
  { value: "PROFESSIONAL", label: "Professional+" },
  { value: "FLUENT", label: "Fluent+" },
  { value: "NATIVE", label: "Native" },
];

function CompanyTalentsSearchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [englishLevelFilter, setEnglishLevelFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const { talents, loading, error, subscriptionRequired, setFilters } =
    useTalentSearch();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("blih_company_talents_view_mode") as ViewMode;
      if (saved === "cards" || saved === "table") {
        setViewMode(saved);
      }
    } catch (e) {}
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("blih_company_talents_view_mode", mode);
    } catch (e) {}
  };

  const handleEnglishFilter = (level: string) => {
    setEnglishLevelFilter(level);
    setFilters((prev) => ({
      ...prev,
      englishLevel: (level as any) || undefined,
    }));
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setFilters((prev) => ({ ...prev, search: q || undefined }));
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Find people whose abilities are already visible.
            </h1>
            <Badge variant="verified">VERIFIED PROFILES</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Search, filter and compare professionals by verified skills,
            evidence strength, availability and fit — before opening a full
            profile.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />
        </div>
      </div>

      {/* Subscription Paywall Prompt */}
      {subscriptionRequired ? (
        <Card className="border border-[#1E5BFF]/30 bg-gradient-to-br from-white to-[#EEF3FF] rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5 shadow-md">
          <div className="w-14 h-14 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
              Active Company Subscription Required
            </h2>
            <p className="text-sm sm:text-base text-[#6E6678] max-w-xl mx-auto font-sans leading-relaxed">
              Searching, discovering, and evaluating verified talent profiles
              requires an active company membership (2,000 ETB/mo or 10,000
              ETB/yr).
            </p>
          </div>
          <div className="pt-2">
            <Link href="/company/subscription">
              <Button variant="primary" size="lg">
                View Subscription Plans & Activate
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Filter & Search Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <UniversalSearch
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onSearch={(q) => handleSearch(q)}
                  placeholder="Search by candidate name, skill, or role..."
                  actionText="Search"
                />
              </div>
              <div className="w-full sm:w-56 shrink-0">
                <Select
                  options={englishLevelFilterOptions}
                  value={englishLevelFilter}
                  onChange={(e) => handleEnglishFilter(e.target.value)}
                  placeholder="Filter English Level"
                />
              </div>
            </div>

            {(searchQuery || englishLevelFilter) && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setEnglishLevelFilter("");
                    setFilters({});
                  }}
                  className="text-xs font-mono text-[#1E5BFF] hover:underline cursor-pointer"
                >
                  Clear active filters
                </button>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="error" title="Candidate Search Error">
              {error}
            </Alert>
          )}

          {/* Talent Grid / Table */}
          {loading ? (
            viewMode === "table" ? (
              <div className="pt-2">
                <CompanyTalentsTable talents={[]} loading={true} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <TalentCardSkeleton key={i} themeIndex={i} />
                ))}
              </div>
            )
          ) : talents.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-[#1E5BFF]" />}
              title="No Candidates Found"
              description="Try adjusting your search criteria or clearing active filters."
            />
          ) : viewMode === "table" ? (
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <CompanyTalentsTable talents={talents} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {talents.map((talent: TalentSearchResultItem) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function CompanyTalentSearchPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyTalentsSearchContent />
    </AuthGuard>
  );
}
