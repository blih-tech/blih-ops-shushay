"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  User,
  FileText,
  Eye,
} from "lucide-react";
import {
  Button,
  Badge,
  Alert,
  UniversalSearch,
  Pagination,
} from "@blih/ui";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import {
  fetchAdminTalents,
} from "@/lib/adminApi";
import type { AdminTalentItem } from "@/types/admin";

const PAGE_SIZE = 20;

function AdminTalentsContent() {
  const [talents, setTalents] = useState<AdminTalentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminTalents({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      setTalents(data.talents);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load talent records");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Talents" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Talent Management
            </h1>
            <Badge variant="primary">{total} REGISTERED</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            Inspect candidate profiles, manage skills access, CV attachments, and career history.
          </p>
        </div>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      <UniversalSearch
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name, email, skill, title, or location..."
      />

      <AdminTable<AdminTalentItem>
        loading={loading}
        data={talents}
        rowKey={(t) => t.id}
        emptyIcon={<User className="h-6 w-6" />}
        emptyTitle="No talent profiles found"
        emptySubtext={searchQuery ? "No candidates match your search." : "Registered candidates will appear here."}
        columns={[
          {
            key: "talent",
            header: "Talent",
            render: (t) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#1E5BFF] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                  {t.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (t.fullName || t.user.email).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">{t.fullName || "Unnamed"}</p>
                  <p className="text-xs text-[#6E6678] truncate">{t.user.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "title",
            header: "Title",
            render: (t) => (
              <span className="text-sm text-[#6E6678] truncate max-w-[160px] block">
                {t.title || "—"}
              </span>
            ),
          },
          {
            key: "location",
            header: "Location",
            width: "130px",
            render: (t) => (
              <span className="text-xs text-[#6E6678]">
                {[t.city, t.country].filter(Boolean).join(", ") || "—"}
              </span>
            ),
          },
          {
            key: "skills",
            header: "Skills",
            render: (t) => (
              <div className="flex flex-wrap gap-1 max-w-[200px]">
                {t.skills.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg bg-[#EEF3FF] text-[10px] font-mono text-[#1E5BFF] font-medium">
                    {s}
                  </span>
                ))}
                {t.skills.length > 3 && (
                  <span className="text-[10px] font-mono text-[#6E6678]">+{t.skills.length - 3}</span>
                )}
              </div>
            ),
          },
          {
            key: "apps",
            header: "Apps",
            width: "60px",
            render: (t) => (
              <span className="font-mono text-sm text-[#17131F] font-medium">{t._count.jobApplications}</span>
            ),
          },
          {
            key: "access",
            header: "Skills Access",
            width: "120px",
            render: (t) =>
              t.user.skillsEntitlement ? (
                <Badge variant="verified" size="sm">Granted</Badge>
              ) : (
                <Badge variant="secondary" size="sm">Not Granted</Badge>
              ),
          },
          {
            key: "cv",
            header: "CV",
            width: "60px",
            render: (t) =>
              t.cvUrl ? (
                <a href={t.cvUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="ghost" leftIcon={<FileText className="h-3 w-3" />}>
                    CV
                  </Button>
                </a>
              ) : (
                <span className="text-xs text-[#D9CEDF]">—</span>
              ),
          },
          {
            key: "actions",
            header: "Actions",
            width: "80px",
            render: (t) => (
              <Link href={`/admin/talents/${t.id}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Eye className="h-3.5 w-3.5" />}
                >
                  View
                </Button>
              </Link>
            ),
          },
        ]}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
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
