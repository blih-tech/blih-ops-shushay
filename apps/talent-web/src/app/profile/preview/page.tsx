"use client";

import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { Button, Badge, Spinner, Alert } from "@/components/ui";
import {
  ArrowLeft,
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
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

function ProfilePreviewContent() {
  const { user } = useAuth();
  const { profile, loading, error } = useTalentProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Spinner size="md" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading preview…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4">
        <Alert variant="error" title="Load Error">
          {error}
        </Alert>
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
    <div className="font-sans">
      {/* Preview mode banner */}
      <div className="bg-foreground text-primary-foreground px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm">
          <Eye className="h-4 w-4 text-dark-muted-foreground" />
          <span className="text-dark-foreground font-medium">
            Recruiter preview mode
          </span>
          <span className="text-dark-muted-foreground hidden sm:inline">
            — This is how companies see your profile
          </span>
        </div>
        <div className="flex items-center gap-2">
          {profile?.cvUrl && (
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="sm"
                variant="outline"
                className="border-dark-border text-dark-foreground bg-transparent hover:bg-dark-card text-xs"
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download CV
              </Button>
            </a>
          )}
          <Link href="/profile/edit">
            <Button
              size="sm"
              variant="primary"
              className="text-xs"
              leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            >
              Back to Editor
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left column: identity + contact */}
          <aside className="lg:col-span-4 space-y-4">

            {/* Identity card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 pt-8 pb-6 text-center">
                <div className="mx-auto h-24 w-24 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden mb-4 relative">
                  {profile?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.photoUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                  {profile?.isComplete && (
                    <div className="absolute bottom-0.5 right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>

                <h2 className="font-serif font-bold text-2xl text-foreground">
                  {profile?.fullName || "Name Not Set"}
                </h2>
                {profile?.title && (
                  <p className="text-sm font-medium text-primary mt-1">
                    {profile.title}
                  </p>
                )}

                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {profile?.isComplete ? (
                    <Badge
                      variant="success"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Active Profile
                    </Badge>
                  ) : (
                    <Badge variant="warning">Incomplete</Badge>
                  )}
                  {profile?.englishLevel && (
                    <Badge variant="secondary">
                      English: {profile.englishLevel.replace("_", " ")}
                    </Badge>
                  )}
                </div>
              </div>

              {profile?.cvUrl && (
                <div className="border-t border-border px-6 py-4">
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 h-9 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    Download CV
                  </a>
                </div>
              )}
            </div>

            {/* Contact card */}
            <div className="bg-card border border-border rounded-xl px-5 py-4 space-y-3">
              <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                Contact
              </p>
              <ul className="space-y-2.5 text-sm text-body">
                <li className="flex items-center gap-2.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </li>
                {profile?.phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {profile.phone}
                  </li>
                )}
                {(profile?.city || profile?.country) && (
                  <li className="flex items-center gap-2.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {[profile.city, profile.country]
                      .filter(Boolean)
                      .join(", ")}
                  </li>
                )}
              </ul>
            </div>

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="bg-card border border-border rounded-xl px-5 py-4 space-y-3">
                <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                  Skills & Expertise
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full border border-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right column: bio + timeline sections */}
          <div className="lg:col-span-8 space-y-6">

            {/* Bio */}
            <div className="bg-card border border-border rounded-xl px-6 py-5 space-y-3">
              <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                Professional Overview
              </p>
              {profile?.bio ? (
                <p className="text-sm sm:text-base text-body leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No professional summary added yet.
                </p>
              )}
            </div>

            {/* Work History */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center gap-2.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-serif font-semibold text-lg text-foreground">
                  Work History
                </h3>
              </div>
              <div className="px-6 py-5">
                {sortedExperience.length > 0 ? (
                  <div className="space-y-6">
                    {sortedExperience.map((exp, i) => (
                      <div
                        key={exp.id}
                        className={`relative pl-5 ${i < sortedExperience.length - 1
                            ? "pb-6 border-l border-border"
                            : ""
                          }`}
                      >
                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-border bg-card" />
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                            <h4 className="font-semibold text-foreground text-base">
                              {exp.title}
                            </h4>
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0 font-mono">
                              <Calendar className="h-3 w-3" />
                              {formatDate(exp.startDate)} –{" "}
                              {exp.current
                                ? "Present"
                                : exp.endDate
                                  ? formatDate(exp.endDate)
                                  : ""}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-primary">
                            {exp.company}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-body leading-relaxed mt-2 whitespace-pre-line">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No work history provided.
                  </p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-serif font-semibold text-lg text-foreground">
                  Education
                </h3>
              </div>
              <div className="px-6 py-5">
                {sortedEducation.length > 0 ? (
                  <div className="space-y-6">
                    {sortedEducation.map((edu, i) => (
                      <div
                        key={edu.id}
                        className={`relative pl-5 ${i < sortedEducation.length - 1
                            ? "pb-6 border-l border-border"
                            : ""
                          }`}
                      >
                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-border bg-card" />
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                            <h4 className="font-semibold text-foreground text-base">
                              {edu.degree}
                            </h4>
                            <span className="text-xs text-muted-foreground font-mono shrink-0">
                              {edu.startYear} – {edu.endYear || "Present"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-body">
                            {edu.institution}
                            {edu.field ? ` · ${edu.field}` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No academic history provided.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Eye icon to avoid an extra import
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ProfilePreviewPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfilePreviewContent />
    </AuthGuard>
  );
}
