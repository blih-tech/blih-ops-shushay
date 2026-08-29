"use client";

import React, { useState } from "react";

import {
  MapPin, Filter,
  FileText, Eye
} from "lucide-react";
import {
  Button, Badge, Card,
  GlobalNavbar, UniversalSearch, Skeleton
} from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";

import { mockTalents, type TalentProfileCard } from "@/data";

function TalentCardSkeleton() {
  return (
    <Card className="border border-[#D9CEDF] rounded-3xl bg-white overflow-hidden p-6 flex flex-col justify-between h-[230px]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Skeleton variant="rectangular" width={48} height={48} className="rounded-2xl" />
            <div className="space-y-2">
              <Skeleton variant="rectangular" width={120} height={18} className="rounded-md" />
              <Skeleton variant="rectangular" width={80} height={12} className="rounded-md" />
            </div>
          </div>
          <Skeleton variant="rectangular" width={70} height={22} className="rounded-lg" />
        </div>
        <Skeleton variant="text" className="w-full" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={50} height={16} className="rounded-md" />
          <Skeleton variant="rectangular" width={60} height={16} className="rounded-md" />
          <Skeleton variant="rectangular" width={55} height={16} className="rounded-md" />
        </div>
      </div>
      <div className="pt-4 border-t border-[#D9CEDF]/50 flex justify-between items-center">
        <Skeleton variant="rectangular" width={40} height={12} className="rounded-md" />
        <Skeleton variant="rectangular" width={90} height={28} className="rounded-md" />
      </div>
    </Card>
  );
}

function CompanyTalentsSearchContent() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkillFilter, setActiveSkillFilter] = useState("All");
  const [selectedTalent, setSelectedTalent] = useState<TalentProfileCard | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);


  const skillFilters = ["All", "React 19", "Next.js", "TypeScript", "Node.js", "PostgreSQL"];

  const filteredTalents = mockTalents.filter((talent) => {
    if (activeSkillFilter !== "All" && !talent.skills.includes(activeSkillFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        talent.name.toLowerCase().includes(q) ||
        talent.title.toLowerCase().includes(q) ||
        talent.location.toLowerCase().includes(q) ||
        talent.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="talents" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                Talent Search & Discovery
              </h1>
              <Badge variant="verified">VERIFIED PROFILES</Badge>
            </div>
            <p className="text-sm sm:text-base text-[#6E6678] font-sans">
              Discover, filter, and review verified candidates backed by evidence and course completions.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          <div className="w-full">
            <UniversalSearch
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, skill, or role..."
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-mono text-[#6E6678] uppercase mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>
            {skillFilters.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setActiveSkillFilter(skill)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${activeSkillFilter === skill
                  ? "bg-[#1E5BFF] text-white shadow-xs"
                  : "bg-[#EEF3FF] text-[#17131F] hover:bg-[#DDE7FF] border border-[#D9CEDF]/70"
                  }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Talent Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <TalentCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {filteredTalents.map((talent) => (
              <Card
                key={talent.id}
                className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden flex flex-col justify-between hover:border-[#1E5BFF]/50 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-lg shadow-xs">
                        {talent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[#17131F]">{talent.name}</h3>
                        <p className="text-xs font-mono text-[#1E5BFF] font-semibold">{talent.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#E6F5F0] text-[#2E8F79] font-mono text-xs font-bold border border-[#2E8F79]/20">
                        {talent.verifiedScore}% MATCH
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6E6678] font-sans line-clamp-2 leading-relaxed">
                    {talent.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {talent.skills.map((skill, si) => (
                      <span
                        key={si}
                        className="px-2.5 py-0.5 rounded-lg bg-[#EEF3FF] border border-[#1E5BFF]/15 text-[11px] font-mono text-[#1E5BFF] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D9CEDF]/60 text-xs font-mono text-[#6E6678]">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
                      <span className="truncate">{talent.location}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#17131F] font-bold">{talent.englishLevel}</span> English
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#EEF3FF]/30 border-t border-[#D9CEDF]/70 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6E6678]">{talent.experienceYears} exp</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                    onClick={() => setSelectedTalent(talent)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: View Full Talent Profile */}
        {selectedTalent && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between pb-4 border-b border-[#D9CEDF]">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-xl shadow-sm">
                    {selectedTalent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#17131F]">{selectedTalent.name}</h2>
                    <p className="text-sm font-mono text-[#1E5BFF] font-medium">{selectedTalent.title}</p>
                    <p className="text-xs text-[#6E6678]">{selectedTalent.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="p-2 text-[#6E6678] hover:text-[#17131F] hover:bg-[#EEF3FF] rounded-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono text-[#6E6678] uppercase">Candidate Biography</p>
                <p className="text-sm text-[#17131F] leading-relaxed bg-[#EEF3FF]/40 p-4 rounded-2xl border border-[#D9CEDF]/70">
                  {selectedTalent.bio}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-[#6E6678] uppercase">Verified Competencies</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTalent.skills.map((skill, si) => (
                    <span
                      key={si}
                      className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/20 text-xs font-mono text-[#1E5BFF] font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#D9CEDF]">
                <Button variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
                  Download Resume
                </Button>
                <Button variant="primary" size="sm" onClick={() => setSelectedTalent(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CompanyTalentSearchPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyTalentsSearchContent />
    </AuthGuard>
  );
}
