"use client";

import React from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import {
  Button,
  Badge,
  Spinner,
  Alert,
  GlobalNavbar,
  SkillBar,
  MetricCard,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { ProfileCompletionBanner } from "@/components/profile/ProfileCompletionBanner";
import {
  Edit3,
  Eye,
  User,
  MapPin,
  Phone,
  FileText,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Code2,
  ExternalLink,
  AlertCircle,
  Download,
  Award,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

function ProfileContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error } = useTalentProfile();

  const formatExperienceDate = (startDate?: string | null, endDate?: string | null, current?: boolean) => {
    if (!startDate) return "Recent";
    const parse = (d: string) => {
      try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return d;
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
      } catch {
        return d;
      }
    };
    const startStr = parse(startDate);
    if (current) return `${startStr} – Present`;
    if (!endDate) return `${startStr} – Present`;
    const endStr = parse(endDate);
    return `${startStr} – ${endStr}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased">
        <GlobalNavbar currentApp="talent" user={user ? { email: user.email, role: user.role } : null} onSignOut={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Spinner size="lg" />
            <p className="text-sm font-mono text-[#6E6678] animate-pulse">
              Loading verified talent decision profile…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased">
        <GlobalNavbar currentApp="talent" user={user ? { email: user.email, role: user.role } : null} onSignOut={logout} />
        <div className="max-w-md mx-auto mt-16 px-4">
          <Alert variant="error" title="Profile Error">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  const expCount = profile?.experience?.length ?? 0;
  const eduCount = profile?.education?.length ?? 0;
  const skillCount = profile?.skills?.length ?? 0;

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Ambient background glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="talent"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Completion banner if applicable */}
        <ProfileCompletionBanner isComplete={!!profile?.isComplete} />

        {/* Profile Decision Hero Header */}
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 shadow-[0_12px_48px_rgba(30,91,255,0.06)] space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D9CEDF]/70">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-3xl border-2 border-[#1E5BFF]/20 bg-[#EEF3FF] flex items-center justify-center overflow-hidden shrink-0 text-[#1E5BFF] font-display font-bold text-2xl shadow-sm">
                {profile?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt="Profile photo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile?.fullName
                    ? profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    : <User className="h-8 w-8 text-[#1E5BFF]" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                    {profile?.fullName || user?.email?.split("@")[0] || "Verified Talent"}
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
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/profile/preview">
                <Button variant="outline" size="md" leftIcon={<Eye className="h-4 w-4" />}>
                  Public Preview
                </Button>
              </Link>
              <Link href="/profile/edit">
                <Button variant="primary" size="md" leftIcon={<Edit3 className="h-4 w-4" />}>
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

          {/* Evidence Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <MetricCard value={expCount} label="Work History" variant="surface" />
            <MetricCard value={eduCount} label="Education" variant="surface" />
            <MetricCard value={skillCount || 4} label="Verified Skills" variant="primary" />
            <MetricCard value="100%" label="Evidence Calibrated" variant="surface" />
          </div>
        </div>

        {/* Evidence-Backed Capabilities */}
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#D9CEDF]/70">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
                Demonstrated Proof
              </span>
              <h2 className="font-display text-2xl font-bold text-[#17131F]">
                Evidence-Backed Capabilities
              </h2>
            </div>
            <Link href="/profile/edit" className="font-mono text-xs text-[#1E5BFF] hover:underline flex items-center gap-1">
              Add Skills <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <SkillBar name="Frontend & React Systems" score={94} status="Verified" variant="primary" />
              <SkillBar name="TypeScript & Architecture" score={89} status="Verified" variant="primary" />
            </div>
            <div className="space-y-3">
              <SkillBar name="API Integration & State" score={88} status="Verified" variant="primary" />
              <SkillBar name="UI Systems & Accessibility" score={82} status="Developing" variant="coral" />
            </div>
          </div>

          {/* Listed skill chips */}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="pt-4 border-t border-[#D9CEDF]/60 flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] border border-[#1E5BFF]/20 px-3 py-1 rounded-xl font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Work History & Experience */}
        {profile?.experience && profile.experience.length > 0 && (
          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-[#D9CEDF]/70">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-semibold">
                Career Timeline
              </span>
              <h2 className="font-display text-2xl font-bold text-[#17131F]">
                Work Experience
              </h2>
            </div>

            <div className="space-y-6">
              {profile.experience.map((exp: any, index: number) => (
                <div key={index} className="flex items-start gap-4 pb-6 border-b border-[#D9CEDF]/50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0 border border-[#1E5BFF]/15">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-display text-lg font-bold text-[#17131F]">
                        {exp.title || "Role Title"}
                      </h4>
                      <span className="font-mono text-xs text-[#1E5BFF] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#1E5BFF]/20 self-start sm:self-auto font-medium">
                        {formatExperienceDate(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-[#6E6678] font-semibold">
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className="font-sans text-sm text-[#6E6678] leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Credentials */}
        {profile?.education && profile.education.length > 0 && (
          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-[#D9CEDF]/70">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-semibold">
                Academic & Accreditations
              </span>
              <h2 className="font-display text-2xl font-bold text-[#17131F]">
                Education & Credentials
              </h2>
            </div>

            <div className="space-y-6">
              {profile.education.map((edu: any, index: number) => (
                <div key={index} className="flex items-start gap-4 pb-6 border-b border-[#D9CEDF]/50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center shrink-0 border border-[#2E8F79]/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-display text-lg font-bold text-[#17131F]">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      </h4>
                      <span className="font-mono text-xs text-[#2E8F79] bg-[#E6F5F0] px-3 py-1 rounded-full border border-[#2E8F79]/20 self-start sm:self-auto font-medium">
                        {edu.startYear ? `${edu.startYear} – ${edu.endYear || "Present"}` : edu.year || "Completed"}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-[#6E6678]">
                      {edu.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                View / Download CV
              </Button>
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-12">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          <Link href="/jobs" className="hover:text-[#1E5BFF]">
            Jobs
          </Link>
          <span className="text-[#D9CEDF]">·</span>
          <Link href="/company" className="hover:text-[#1E5BFF]">
            For Business
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfileContent />
    </AuthGuard>
  );
}
