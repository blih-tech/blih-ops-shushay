"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Alert, Badge, Button, MetricCard } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import {
  fetchAdminTalentById,
  grantAdminSkillsAccess,
  revokeAdminSkillsAccess,
} from "@/lib/adminApi";

function AdminTalentDetailContent() {
  const params = useParams();
  const talentId = params.talentId as string;

  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminTalentById(talentId);
        setTalent(data);
      } catch (err: any) {
        setError(err.message || "Failed to load talent profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [talentId]);

  async function handleGrantAccess() {
    if (!talent?.user?.id) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await grantAdminSkillsAccess(talent.user.id);
      const updated = await fetchAdminTalentById(talentId);
      setTalent(updated);
    } catch (err: any) {
      setActionError(err.message || "Failed to grant skills access");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRevokeAccess() {
    if (!talent?.user?.id) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await revokeAdminSkillsAccess(talent.user.id);
      const updated = await fetchAdminTalentById(talentId);
      setTalent(updated);
    } catch (err: any) {
      setActionError(err.message || "Failed to revoke skills access");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb items={[{ label: "Talents", href: "/admin/talents" }, { label: "Loading..." }]} />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !talent) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb items={[{ label: "Talents", href: "/admin/talents" }, { label: "Error" }]} />
        <Alert variant="error">{error || "Talent profile not found"}</Alert>
      </main>
    );
  }

  const hasAccess = !!talent.user?.skillsEntitlement;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <AdminBreadcrumb items={[{ label: "Talents", href: "/admin/talents" }, { label: talent.fullName }]} />

      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>{actionError}</Alert>
      )}

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard value={talent._count?.jobApplications ?? 0} label="Applications" variant="primary" />
        <MetricCard value={talent.experience?.length ?? 0} label="Work History" variant="surface" />
        <MetricCard value={talent.englishLevel || "—"} label="English Level" variant="surface" />
        <MetricCard value={talent.skills?.length ?? 0} label="Skills Listed" variant="surface" />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-2xl shrink-0 overflow-hidden">
                {talent.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={talent.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  talent.fullName?.charAt(0).toUpperCase() || "T"
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                      {talent.fullName}
                    </h1>
                    {hasAccess ? (
                      <Badge variant="success">SKILLS ACCESS</Badge>
                    ) : (
                      <Badge variant="secondary">NO ACCESS</Badge>
                    )}
                  </div>
                  {talent.title && (
                    <p className="text-sm font-medium text-[#6E6678]">{talent.title}</p>
                  )}
                </div>
                {/* Inline data chips */}
                <div className="flex flex-wrap gap-2">
                  {talent.user?.email && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      <Mail className="h-3 w-3 shrink-0" />
                      {talent.user.email}
                    </span>
                  )}
                  {(talent.city || talent.country) && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {[talent.city, talent.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {talent.englishLevel && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                      English: {talent.englishLevel}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                    {talent._count?.jobApplications ?? 0} applications
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {hasAccess ? (
                <Button size="sm" variant="outline" onClick={handleRevokeAccess} isLoading={actionLoading}
                  leftIcon={<XCircle className="h-3.5 w-3.5 text-[#D32F2F]" />}>
                  Revoke Access
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={handleGrantAccess} isLoading={actionLoading}
                  leftIcon={<CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />}>
                  Grant Access
                </Button>
              )}
              {talent.user?.id && (
                <Link href={`/admin/users/${talent.user.id}`}>
                  <Button size="sm" variant="outline">User Account</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="divide-y divide-[#EBE5F0]">

          {/* Bio */}
          {talent.bio && (
            <div className="p-6 sm:p-8 space-y-3">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">Bio</h2>
              <p className="text-sm text-[#6E6678] leading-relaxed whitespace-pre-line">{talent.bio}</p>
            </div>
          )}

          {/* Skills */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="p-6 sm:p-8 space-y-3">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {talent.experience && talent.experience.length > 0 && (
            <div className="p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" /> Work Experience
              </h2>
              <div className="space-y-4">
                {talent.experience.map((exp: any, i: number) => (
                  <div key={exp.id} className={`flex gap-4 ${i > 0 ? "pt-4 border-t border-[#F9F8FC]" : ""}`}>
                    <div className="w-8 h-8 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase className="h-3.5 w-3.5 text-[#6E6678]" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="font-medium text-[#17131F] text-sm">
                        {exp.title} <span className="text-[#6E6678] font-normal">at {exp.company}</span>
                      </p>
                      <p className="text-xs font-mono text-[#6E6678]">
                        {new Date(exp.startDate).toLocaleDateString()} – {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
                      </p>
                      {exp.description && <p className="text-sm text-[#6E6678] mt-1">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {talent.education && talent.education.length > 0 && (
            <div className="p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </h2>
              <div className="space-y-3">
                {talent.education.map((edu: any, i: number) => (
                  <div key={edu.id} className={`flex gap-4 ${i > 0 ? "pt-3 border-t border-[#F9F8FC]" : ""}`}>
                    <div className="w-8 h-8 rounded-xl bg-[#F3F0FF] border border-[#7C3AED]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="h-3.5 w-3.5 text-[#7C3AED]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium text-[#17131F] text-sm">
                        {edu.degree} in {edu.fieldOfStudy || edu.field}
                      </p>
                      <p className="text-xs text-[#6E6678]">
                        {edu.institution} · {edu.startYear} – {edu.endYear || "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {(talent.cvUrl || talent.portfolioUrl || talent.githubUrl || talent.linkedinUrl) && (
            <div className="p-6 sm:p-8 space-y-3">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                Portfolio &amp; Documents
              </h2>
              <div className="flex flex-wrap gap-3">
                {talent.cvUrl && (
                  <a href={talent.cvUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1E5BFF] font-medium text-xs bg-[#EEF3FF] hover:bg-[#DDE7FF] px-3 py-2 rounded-xl border border-[#1E5BFF]/15 transition-colors">
                    <FileText className="h-4 w-4" /> Resume / CV
                  </a>
                )}
                {talent.portfolioUrl && (
                  <a href={talent.portfolioUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#17131F] font-medium text-xs bg-[#F9F8FC] hover:bg-[#EBE5F0] px-3 py-2 rounded-xl border border-[#D9CEDF] transition-colors">
                    <Globe className="h-4 w-4" /> Portfolio
                  </a>
                )}
                {talent.githubUrl && (
                  <a href={talent.githubUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#17131F] font-medium text-xs bg-[#F9F8FC] hover:bg-[#EBE5F0] px-3 py-2 rounded-xl border border-[#D9CEDF] transition-colors">
                    <Globe className="h-4 w-4" /> GitHub
                  </a>
                )}
                {talent.linkedinUrl && (
                  <a href={talent.linkedinUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#0A66C2] font-medium text-xs bg-[#F9F8FC] hover:bg-[#EBE5F0] px-3 py-2 rounded-xl border border-[#D9CEDF] transition-colors">
                    <Globe className="h-4 w-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function AdminTalentDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminTalentDetailContent />
    </AuthGuard>
  );
}
