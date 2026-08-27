"use client";

import React from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { Button, Badge, Spinner, Alert, GlobalNavbar } from "@/components/ui";
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Briefcase,
  GraduationCap,
  Calendar,
  User,
  CheckCircle2,
  Edit3,
  Eye,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

function ProfilePreviewContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error } = useTalentProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <Spinner size="md" />
            <p className="text-sm text-[#6E6678] font-sans">
              Loading preview…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />
        <div className="max-w-md mx-auto mt-12 px-4">
          <Alert variant="error" title="Load Error">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  const sortedExperience = profile?.experience
    ? [...profile.experience].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )
    : [];

  const sortedEducation = profile?.education
    ? [...profile.education].sort((a, b) => b.startYear - a.startYear)
    : [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div className="min-h-screen bg-white text-[#17131F] font-sans">
      <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />

      {/* Preview mode banner */}
      <div className="bg-[#17131F] text-white px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm font-sans">
            <Eye className="h-4 w-4 text-[#FF8A5B]" />
            <span className="font-semibold text-white">
              Recruiter Preview Mode
            </span>
            <span className="text-[#6E6678] hidden sm:inline">
              — This is how companies and hiring managers view your verified profile
            </span>
          </div>
          <div className="flex items-center gap-2">
            {profile?.cvUrl && (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-xs"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                >
                  Download CV
                </Button>
              </a>
            )}
            <Link href="/profile/edit">
              <Button
                size="sm"
                variant="coral"
                className="text-xs font-bold"
                leftIcon={<Edit3 className="h-3.5 w-3.5" />}
              >
                Back to Editor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: identity + contact */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 text-center shadow-sm">
              <div className="mx-auto h-28 w-28 rounded-full border-2 border-[#1E5BFF]/20 bg-[#EEF3FF] flex items-center justify-center overflow-hidden mb-4 relative">
                {profile?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-[#6E6678]" />
                )}
                {profile?.isComplete && (
                  <div className="absolute bottom-1 right-1 h-5 w-5 bg-[#2E8F79] rounded-full border-2 border-white flex items-center justify-center text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              <h2 className="font-display font-bold text-2xl text-[#17131F]">
                {profile?.fullName || "Name Not Set"}
              </h2>
              {profile?.title && (
                <p className="text-sm font-medium text-[#1E5BFF] mt-1">
                  {profile.title}
                </p>
              )}

              <div className="flex justify-center gap-2 mt-3">
                <Badge variant={profile?.isComplete ? "verified" : "secondary"}>
                  {profile?.isComplete ? "Verified Profile" : "In Progress"}
                </Badge>
                {profile?.englishLevel && (
                  <Badge variant="outline">
                    {profile.englishLevel}
                  </Badge>
                )}
              </div>

              {/* Contact info list */}
              <div className="mt-6 pt-6 border-t border-[#D9CEDF] space-y-3 text-left text-sm text-[#6E6678]">
                {user?.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-[#1E5BFF] shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[#1E5BFF] shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {(profile?.city || profile?.country) && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-[#1E5BFF] shrink-0" />
                    <span>{[profile.city, profile.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills chip card */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="font-display font-bold text-base text-[#17131F]">
                  Core Capabilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[#EEF3FF] text-[#1E5BFF] border border-[#1E5BFF]/20 rounded-full text-xs font-mono font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right column: bio + experience + education */}
          <div className="lg:col-span-8 space-y-6">
            {/* Bio Card */}
            {profile?.bio && (
              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
                <h3 className="font-display font-bold text-xl text-[#17131F]">
                  About & Background
                </h3>
                <p className="text-[#17131F] leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Work Experience */}
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-[#1E5BFF]" />
                <h3 className="font-display font-bold text-xl text-[#17131F]">
                  Work Experience
                </h3>
              </div>

              {sortedExperience.length === 0 ? (
                <p className="text-sm text-[#6E6678]">No experience records added yet.</p>
              ) : (
                <div className="space-y-6 divide-y divide-[#D9CEDF]/70">
                  {sortedExperience.map((exp, idx) => (
                    <div key={exp.id || idx} className={idx > 0 ? "pt-6" : ""}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h4 className="font-display font-bold text-base text-[#17131F]">
                          {exp.title}
                        </h4>
                        <span className="text-xs font-mono text-[#6E6678]">
                          {formatDate(exp.startDate)} – {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#1E5BFF]">{exp.company}</p>
                      {exp.description && (
                        <p className="text-sm text-[#6E6678] mt-2 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-[#1E5BFF]" />
                <h3 className="font-display font-bold text-xl text-[#17131F]">
                  Education & Credentials
                </h3>
              </div>

              {sortedEducation.length === 0 ? (
                <p className="text-sm text-[#6E6678]">No education records added yet.</p>
              ) : (
                <div className="space-y-6 divide-y divide-[#D9CEDF]/70">
                  {sortedEducation.map((edu, idx) => (
                    <div key={edu.id || idx} className={idx > 0 ? "pt-6" : ""}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h4 className="font-display font-bold text-base text-[#17131F]">
                          {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                        </h4>
                        <span className="text-xs font-mono text-[#6E6678]">
                          {edu.startYear} – {edu.endYear || "Present"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#1E5BFF]">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePreviewPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfilePreviewContent />
    </AuthGuard>
  );
}
