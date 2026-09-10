"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
  Phone,
} from "lucide-react";
import { Alert, Badge, Button } from "@blih/ui";
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
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[{ label: "Talents", href: "/admin/talents" }, { label: "Loading..." }]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !talent) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[{ label: "Talents", href: "/admin/talents" }, { label: "Error" }]}
        />
        <Alert variant="error">{error || "Talent profile not found"}</Alert>
      </main>
    );
  }

  const hasAccess = !!talent.user?.skillsEntitlement;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Talents", href: "/admin/talents" },
          { label: talent.fullName },
        ]}
      />

      {actionError && (
        <Alert variant="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-2xl shrink-0 overflow-hidden">
                {talent.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={talent.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  talent.fullName?.charAt(0).toUpperCase() || "T"
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {talent.fullName}
                  </h1>
                  {hasAccess ? (
                    <Badge variant="success">SKILLS ACCESS GRANTED</Badge>
                  ) : (
                    <Badge variant="secondary">NO SKILLS ACCESS</Badge>
                  )}
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-3 flex-wrap">
                  <span className="font-medium text-[#17131F]">{talent.title || "Talent Profile"}</span>
                  {talent.user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {talent.user.email}
                    </span>
                  )}
                  {(talent.city || talent.country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {[talent.city, talent.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {hasAccess ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRevokeAccess}
                  isLoading={actionLoading}
                  leftIcon={<XCircle className="h-3.5 w-3.5 text-[#D32F2F]" />}
                >
                  Revoke Access
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleGrantAccess}
                  isLoading={actionLoading}
                  leftIcon={<CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />}
                >
                  Grant Access
                </Button>
              )}
              {talent.user?.id && (
                <Link href={`/admin/users/${talent.user.id}`}>
                  <Button size="sm" variant="outline">
                    User Account
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Integrated Stat Strip */}
          <div className="mt-6 pt-6 border-t border-[#EBE5F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Phone</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">{talent.phone || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">English Level</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">{talent.englishLevel || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Applications Submitted</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {talent._count?.jobApplications || 0}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Work History Entries</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {talent.experience?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Bio */}
          {talent.bio && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-base text-[#17131F]">Bio / Professional Summary</h2>
              <p className="text-sm text-[#6E6678] leading-relaxed whitespace-pre-line">
                {talent.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="pt-8 space-y-3">
              <h2 className="font-display font-bold text-base text-[#17131F]">Verified & Stated Skills</h2>
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
            <div className="pt-8 space-y-4">
              <h2 className="font-display font-bold text-base text-[#17131F] flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#1E5BFF]" /> Work Experience
              </h2>
              <div className="space-y-4 divide-y divide-[#EBE5F0]">
                {talent.experience.map((exp: any) => (
                  <div key={exp.id} className="pt-3 first:pt-0 space-y-1">
                    <p className="font-medium text-[#17131F] text-sm">{exp.title} <span className="text-[#6E6678]">at {exp.company}</span></p>
                    <p className="text-xs font-mono text-[#6E6678]">
                      {new Date(exp.startDate).toLocaleDateString()} – {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
                    </p>
                    {exp.description && <p className="text-sm text-[#6E6678] mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {talent.education && talent.education.length > 0 && (
            <div className="pt-8 space-y-4">
              <h2 className="font-display font-bold text-base text-[#17131F] flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#7C3AED]" /> Education
              </h2>
              <div className="space-y-3 divide-y divide-[#EBE5F0]">
                {talent.education.map((edu: any) => (
                  <div key={edu.id} className="pt-3 first:pt-0 space-y-1">
                    <p className="font-medium text-[#17131F] text-sm">{edu.degree} in {edu.fieldOfStudy || edu.field}</p>
                    <p className="text-xs text-[#6E6678]">{edu.institution} ({edu.startYear} – {edu.endYear || "Present"})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents / Portfolio links */}
          {(talent.cvUrl || talent.portfolioUrl || talent.githubUrl || talent.linkedinUrl) && (
            <div className="pt-8 space-y-3">
              <h2 className="font-display font-bold text-base text-[#17131F]">Portfolio & Documents</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                {talent.cvUrl && (
                  <a
                    href={talent.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1E5BFF] hover:underline font-medium text-xs bg-[#EEF3FF] px-3 py-1.5 rounded-xl border border-[#1E5BFF]/15"
                  >
                    <FileText className="h-4 w-4" /> Download Resume / CV
                  </a>
                )}
                {talent.portfolioUrl && (
                  <a
                    href={talent.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1E5BFF] hover:underline font-medium text-xs bg-[#F9F8FC] px-3 py-1.5 rounded-xl border border-[#D9CEDF]"
                  >
                    <Globe className="h-4 w-4" /> Portfolio Site
                  </a>
                )}
                {talent.githubUrl && (
                  <a
                    href={talent.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#17131F] hover:underline font-medium text-xs bg-[#F9F8FC] px-3 py-1.5 rounded-xl border border-[#D9CEDF]"
                  >
                    <Globe className="h-4 w-4" /> GitHub
                  </a>
                )}
                {talent.linkedinUrl && (
                  <a
                    href={talent.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#0A66C2] hover:underline font-medium text-xs bg-[#F9F8FC] px-3 py-1.5 rounded-xl border border-[#D9CEDF]"
                  >
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
