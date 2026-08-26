"use client";

import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import {
  Button,
  Badge,
  Spinner,
  Alert,
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
} from "lucide-react";

function ProfileContent() {
  const { user } = useAuth();
  const { profile, loading, error } = useTalentProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Spinner size="md" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4">
        <Alert variant="error" title="Dashboard Error">
          {error}
        </Alert>
      </div>
    );
  }

  const expCount = profile?.experience?.length ?? 0;
  const eduCount = profile?.education?.length ?? 0;
  const skillCount = profile?.skills?.length ?? 0;

  const stats = [
    { label: "Work History", value: expCount, icon: Briefcase },
    { label: "Education", value: eduCount, icon: GraduationCap },
    { label: "Skills Listed", value: skillCount, icon: Code2 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">

      {/* Completion banner */}
      <ProfileCompletionBanner isComplete={!!profile?.isComplete} />

      {/* Page actions */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Link href="/profile/preview">
          <Button variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
            Preview
          </Button>
        </Link>
        <Link href="/profile/edit">
          <Button variant="primary" size="sm" leftIcon={<Edit3 className="h-3.5 w-3.5" />}>
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile identity card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Card header band */}
        <div className="bg-muted border-b border-border px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full border border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0">
              {profile?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photoUrl}
                  alt="Profile photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h2 className="font-serif font-semibold text-xl text-foreground leading-snug">
                {profile?.fullName || (
                  <span className="text-muted-foreground italic font-sans font-normal text-base">
                    Name not set
                  </span>
                )}
              </h2>
              {profile?.title && (
                <p className="text-sm text-primary font-medium mt-0.5">
                  {profile.title}
                </p>
              )}
            </div>
          </div>

          {profile?.isComplete ? (
            <Badge
              variant="success"
              className="flex items-center gap-1.5 shrink-0"
            >
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge
              variant="warning"
              className="flex items-center gap-1.5 shrink-0"
            >
              <AlertCircle className="h-3 w-3" />
              Incomplete
            </Badge>
          )}
        </div>

        {/* Data rows */}
        <div className="divide-y divide-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {/* Contact */}
            <div className="px-6 py-4 space-y-3">
              <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                Contact
              </p>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {profile?.phone || (
                    <span className="italic text-muted-foreground">
                      Phone not set
                    </span>
                  )}
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {profile?.city && profile?.country
                    ? `${profile.city}, ${profile.country}`
                    : profile?.country || profile?.city || (
                      <span className="italic text-muted-foreground">
                        Location not set
                      </span>
                    )}
                </li>
              </ul>
            </div>

            {/* CV */}
            <div className="px-6 py-4 space-y-3">
              <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                Curriculum Vitae
              </p>
              {profile?.cvUrl ? (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  View uploaded CV
                  <Download className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No CV uploaded yet
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <div className="px-6 py-4 space-y-2">
              <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                About
              </p>
              <p className="text-sm text-body leading-relaxed max-w-2xl line-clamp-3">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden bg-card">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="px-5 py-5 text-center space-y-2">
            <div className="mx-auto h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-serif font-semibold text-2xl text-foreground">
              {value}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Skills preview */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="bg-card border border-border rounded-xl px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Skills
            </h3>
            <Link href="/profile/edit" className="text-xs text-primary hover:underline flex items-center gap-1">
              Edit <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
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

      {/* Email row */}
      <div className="text-xs text-muted-foreground text-center border-t border-border pt-4">
        Signed in as <span className="font-medium text-foreground">{user?.email}</span>
      </div>

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

