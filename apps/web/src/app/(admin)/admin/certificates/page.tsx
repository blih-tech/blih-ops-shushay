"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Award, Download, Eye, Trash2 } from "lucide-react";
import { Alert, Badge, UniversalSearch, Pagination, ConfirmDialog, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminCertificates, deleteAdminCertificate } from "@/lib/adminApi";
import type { AdminCertificate } from "@/types/admin";

const PAGE_SIZE = 25;

function AdminCertificatesContent() {
  const [certs, setCerts] = useState<AdminCertificate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCertificate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminCertificates({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      setCerts(data.certificates);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  async function handleDeleteCert() {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    setActionError(null);
    try {
      await deleteAdminCertificate(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete certificate");
    } finally {
      setActionLoading(null);
    }
  }

  const recipientName = (c: AdminCertificate) =>
    c.user.talentProfile?.fullName || c.user.email.split("@")[0];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminBreadcrumb items={[{ label: "Certificates" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
              Certificates
            </h1>
            <Badge variant="primary">{total} ISSUED</Badge>
          </div>
          <p className="text-sm text-[#6E6678]">
            All verified course completion certificates issued on the platform.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      <UniversalSearch
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by certificate number, recipient name, or email..."
      />

      <AdminTable<AdminCertificate>
        loading={loading}
        data={certs}
        rowKey={(c) => c.id}
        emptyIcon={<Award className="h-6 w-6" />}
        emptyTitle="No certificates found"
        emptySubtext={
          searchQuery
            ? "Try a different search term."
            : "No certificates issued yet."
        }
        columns={[
          {
            key: "recipient",
            header: "Recipient",
            render: (c) => (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                  {c.user.talentProfile?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.user.talentProfile.photoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    recipientName(c).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#17131F] truncate">
                    {recipientName(c)}
                  </p>
                  <p className="text-xs text-[#6E6678] truncate">
                    {c.user.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "course",
            header: "Course",
            render: (c) => (
              <span className="font-medium text-sm text-[#17131F] truncate max-w-[200px] block">
                {c.course.title}
              </span>
            ),
          },
          {
            key: "certNumber",
            header: "Certificate No.",
            render: (c) => (
              <span
                className="font-mono text-xs text-[#6E6678] truncate max-w-[220px] block"
                title={c.certificateNumber}
              >
                {c.certificateNumber}
              </span>
            ),
          },
          {
            key: "issueDate",
            header: "Issued",
            width: "120px",
            render: (c) => (
              <span className="text-xs font-mono text-[#6E6678]">
                {new Date(c.issueDate).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            width: "180px",
            render: (c) => (
              <div className="flex items-center gap-1.5">
                <Link href={`/admin/certificates/${c.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                  >
                    View
                  </Button>
                </Link>
                {c.pdfUrl && (
                  <a href={c.pdfUrl} target="_blank" rel="noreferrer">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      PDF
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828]"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setDeleteTarget(c)}
                  isLoading={actionLoading === c.id}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Certificate"
        message={`Are you sure you want to delete certificate ${deleteTarget?.certificateNumber}?`}
        confirmText="Delete Certificate"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteCert}
        onClose={() => setDeleteTarget(null)}
      />
    </main>
  );
}

export default function AdminCertificatesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCertificatesContent />
    </AuthGuard>
  );
}
