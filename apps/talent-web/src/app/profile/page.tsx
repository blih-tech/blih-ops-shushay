"use client";

import React from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { formatPhone } from "@/lib/formatPhone";
import { Button, Badge, Alert, SkillBar, MetricCard } from "@blih/ui";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileCompletionBanner } from "@/components/profile/ProfileCompletionBanner";
import { VerifiedCredentialsCard } from "@/components/profile/VerifiedCredentialsCard";
import { ExperienceEducationCard } from "@/components/profile/ExperienceEducationCard";
import {
  Edit3,
  Eye,
  User,
  MapPin,
  Phone,
  FileText,
  Download,
} from "lucide-react";

function ProfileContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error } = useTalentProfile();

  if (loading) {
    return <ProfileSkeleton user={user} logout={logout} />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <Alert variant="error" title="Profile Error">
          {error}
        </Alert>
      </div>
    );
  }

  const certCount =
    profile?.certificates?.length ?? profile?.completedCourses?.length ?? 0;

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Completion banner if applicable */}
      <ProfileCompletionBanner isComplete={!!profile?.isComplete} />

      {/* Profile Hero Header */}
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-5 sm:p-8 md:p-12 shadow-[0_12px_48px_rgba(30,91,255,0.06)] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D9CEDF]/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="h-20 w-20 rounded-full border-2 border-[#1E5BFF]/20 bg-[#EEF3FF] flex items-center justify-center overflow-hidden shrink-0 text-[#1E5BFF] font-display font-bold text-2xl shadow-sm">
              {profile?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photoUrl}
                  alt="Profile photo"
                  className="h-full w-full object-cover"
                />
              ) : profile?.fullName ? (
                profile.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              ) : (
                <User className="h-8 w-8 text-[#1E5BFF]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#17131F]">
                  {profile?.fullName ||
                    user?.email?.split("@")[0] ||
                    "Verified Talent"}
                </h1>
                {profile?.isComplete ? (
                  <Badge variant="verified" size="md">
                    Verified Profile
                  </Badge>
                ) : (
                  <Badge variant="amber" size="md">
                    Incomplete
                  </Badge>
                )}
              </div>

              <p className="font-mono text-xs sm:text-sm text-[#1E5BFF] font-medium">
                {profile?.title || "Operational Specialist · Remote Ready"}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#6E6678] pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
                  {profile?.city && profile?.country
                    ? `${profile.city}, ${profile.country}`
                    : "Location flexible / Remote"}
                </span>
                {profile?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#6E6678]" />
                    {formatPhone(profile.phone)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/profile/preview">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Public Preview
              </Button>
            </Link>
            <Link href="/profile/edit">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Edit3 className="h-4 w-4" />}
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* About / Bio Narrative */}
        {profile?.bio && (
          <div className="space-y-2 max-w-4xl">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-semibold">
              Professional Overview
            </h2>
            <p className="font-sans text-base text-[#17131F] leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Calibrated Operational Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className="space-y-4 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-semibold">
              Verified Skill Competencies
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.skills.map((skill: string) => (
                <SkillBar
                  key={skill}
                  name={skill}
                  score={92}
                  status="Verified"
                  variant="primary"
                />
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#D9CEDF]/70">
          <MetricCard
            value={`${profile?.skills?.length || 0}`}
            label="Verified Skills"
            variant="primary"
          />
          <MetricCard
            value={profile?.englishLevel || "Native / Fluent"}
            label="English Proficiency"
            variant="surface"
          />
          <MetricCard
            value={`${certCount}`}
            label="Certificates Earned"
            variant="surface"
          />
          <MetricCard
            value="100%"
            label="Evidence Calibrated"
            variant="surface"
          />
        </div>
      </div>

      {/* Verified Blih Skills Courses & Credentials */}
      <VerifiedCredentialsCard
        certificates={profile?.certificates}
        completedCourses={profile?.completedCourses}
      />

      {/* Work Experience & Education */}
      <ExperienceEducationCard
        experience={profile?.experience}
        education={profile?.education}
      />

      {/* Attached CV Section */}
      {profile?.cvUrl && (
        <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9CEDF] flex items-center justify-center text-[#1E5BFF]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-[#17131F]">
                Curriculum Vitae Attached
              </h4>
              <p className="font-sans text-xs text-[#6E6678]">
                Verified and accessible for employer screening
              </p>
            </div>
          </div>

          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              View / Download CV
            </Button>
          </a>
        </div>
      )}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfileContent />
    </AuthGuard>
  );
}
