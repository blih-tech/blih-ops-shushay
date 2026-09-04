"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, FileText, Eye } from "lucide-react";
import {
  Button,
  Badge,
  Alert,
  Card,
  UniversalSearch,
  Skeleton,
} from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAdminTalents } from "@/lib/adminApi";
import { TalentInspectModal } from "@/components/admin/TalentInspectModal";
import type { AdminTalentItem } from "@/types/admin";

function AdminTalentsContent() {
  const { user, logout } = useAuth();
  const [talents, setTalents] = useState<AdminTalentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTalent, setSelectedTalent] = useState<AdminTalentItem | null>(
    null,
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminTalents();
        setTalents(data);
      } catch (err: any) {
        setError(err.message || "Failed to load talent records");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTalents = talents.filter((t) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (t.fullName && t.fullName.toLowerCase().includes(q)) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.user.email && t.user.email.toLowerCase().includes(q)) ||
      t.skills.some((s) => s.toLowerCase().includes(q)) ||
      (t.city && t.city.toLowerCase().includes(q))
    );
  });

  return (
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
          <div className="space-y-1.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Hub
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                Talent Management
              </h1>
              <Badge variant="primary">{talents.length} REGISTERED</Badge>
            </div>
            <p className="text-sm text-[#6E6678]">
              Inspect registered talent profiles, verify competencies, CV attachments, and career history.
            </p>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="w-full">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search talents by name, skill, email, or title..."
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" className="h-12 w-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="rectangular" className="h-6 w-3/4 rounded-lg" />
                    <Skeleton variant="rectangular" className="h-4 w-1/2 rounded-lg" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="border-2 border-dashed border-[#D9CEDF] rounded-3xl p-12 text-center bg-white space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto">
              <User className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#17131F]">
              No talent profiles found
            </h3>
            <p className="text-sm text-[#6E6678] max-w-sm mx-auto">
              {searchQuery ? "No candidates match your search query." : "Registered candidates will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((talent) => (
              <Card
                key={talent.id}
                className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden flex flex-col justify-between hover:border-[#1E5BFF]/50 transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-lg overflow-hidden shrink-0 shadow-xs">
                      {talent.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={talent.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(talent.fullName || talent.user.email).charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold text-[#17131F] truncate">
                        {talent.fullName || "Candidate"}
                      </h3>
                      <p className="text-xs font-mono text-[#1E5BFF] truncate font-medium">
                        {talent.title || "Talent Member"}
                      </p>
                      <p className="text-xs text-[#6E6678] truncate mt-0.5">{talent.user.email}</p>
                    </div>
                  </div>

                  {talent.bio && (
                    <p className="text-xs text-[#6E6678] font-sans line-clamp-2 leading-relaxed">
                      {talent.bio}
                    </p>
                  )}

                  {talent.skills && talent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {talent.skills.slice(0, 4).map((skill, si) => (
                        <span
                          key={si}
                          className="px-2.5 py-0.5 rounded-lg bg-[#EEF3FF] border border-[#1E5BFF]/15 text-[11px] font-mono text-[#1E5BFF] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {talent.skills.length > 4 && (
                        <span className="text-[11px] font-mono text-[#6E6678] self-center">
                          +{talent.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-3.5 bg-[#EEF3FF]/30 border-t border-[#D9CEDF]/70 flex items-center justify-between">
                  {talent.cvUrl ? (
                    <a
                      href={talent.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#1E5BFF] hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <FileText className="h-3.5 w-3.5" /> View CV
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-[#6E6678]">No CV Attached</span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                    onClick={() => setSelectedTalent(talent)}
                  >
                    Inspect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <TalentInspectModal talent={selectedTalent} onClose={() => setSelectedTalent(null)} />
      </main>
  );
}


export default function AdminTalentsPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminTalentsContent />
    </AuthGuard>
  );
}
