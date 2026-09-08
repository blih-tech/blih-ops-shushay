"use client";

import React, { useRef } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { formatPhone } from "@/lib/formatPhone";
import { Button, Badge, Alert } from "@blih/ui";
import { ProfilePreviewSkeleton } from "@/components/profile/ProfileSkeleton";
import { VerifiedCredentialsCard } from "@/components/profile/VerifiedCredentialsCard";
import { ExperienceEducationCard } from "@/components/profile/ExperienceEducationCard";
import {
  Download,
  Edit3,
  Eye,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function ProfilePreviewContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error } = useTalentProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".reveal-profile-block",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef },
  );

  if (loading) {
    return <ProfilePreviewSkeleton user={user} logout={logout} />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Alert variant="error" title="Load Error">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full font-sans selection:bg-[#DDE7FF]"
    >

      {/* Preview mode banner */}
      <div className="bg-[#17131F] text-white px-4 sm:px-6 py-3 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm font-sans">
            <Eye className="h-4 w-4 text-[#FF8A5B]" />
            <span className="font-semibold text-white">
              Recruiter Preview Mode
            </span>
            <span className="text-[#6E6678] hidden sm:inline">
              — This is how companies and hiring managers view your verified
              profile
            </span>
          </div>
          <div className="flex items-center gap-2">
            {profile?.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white bg-white/10 hover:bg-white/20 text-xs"
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Talent Profile Hero Section */}
        <section className="reveal-profile-block border-b border-[#E6EAF3] pb-12">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              {/* Profile Portrait */}
              <div className="h-[118px] w-[118px] rounded-full border border-[#BFD0FF] bg-[#EEF3FF] flex items-center justify-center overflow-hidden shrink-0 relative">
                {profile?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display font-bold text-[34px] text-[#1E5BFF]">
                    {profile?.fullName
                      ? profile.fullName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                      : "ST"}
                  </span>
                )}
                {profile?.isComplete && (
                  <div className="absolute bottom-1 right-1 h-5 w-5 bg-[#2E8F79] rounded-full border-2 border-white flex items-center justify-center text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#17131F] leading-tight tracking-tight">
                  {profile?.fullName || "Mikeal Tadesse"}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-sans text-xl font-semibold text-[#1E5BFF]">
                    {profile?.title || "Product Designer"}
                  </h3>
                  {profile?.englishLevel && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5"
                    >
                      <Globe className="h-3 w-3 inline mr-1 text-[#1E5BFF]" />
                      English: {profile.englishLevel}
                    </Badge>
                  )}
                </div>

                {/* Contact & Location Strip */}
                <div className="flex flex-col gap-y-1.5 text-sm text-[#6E6678] pt-2 font-mono">
                  {user?.email && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1E5BFF] font-sans font-semibold w-16">
                        Email:
                      </span>
                      <span className="text-[#17131F] font-semibold">
                        {user.email}
                      </span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1E5BFF] font-sans font-semibold w-16">
                        Phone:
                      </span>
                      <span className="text-[#17131F] font-semibold">
                        {formatPhone(profile.phone)}
                      </span>
                    </div>
                  )}
                  {(profile?.city || profile?.country) && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1E5BFF] font-sans font-semibold w-16">
                        Location:
                      </span>
                      <span className="text-[#17131F] font-semibold">
                        {[profile.city, profile.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specialization / Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="font-sans text-xs font-bold text-[#6E6678] uppercase tracking-wider block">
                  Core Capabilities
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[#F4F7FF] text-[#1E5BFF] border border-[#1E5BFF]/10 rounded-full text-xs font-mono font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio Narrative */}
            {profile?.bio && (
              <div className="space-y-3 pt-4 border-t border-[#E6EAF3]/75">
                <span className="font-sans text-xs font-bold text-[#6E6678] uppercase tracking-wider block">
                  Biography
                </span>
                <p className="font-sans text-[18px] text-[#17131F] leading-relaxed font-normal whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Reusable Verified Blih Credentials Section */}
        <div className="reveal-profile-block">
          <VerifiedCredentialsCard
            certificates={profile?.certificates || profile?.completedCourses || []}
          />
        </div>

        {/* Reusable Experience & Education Timeline */}
        <div className="reveal-profile-block">
          <ExperienceEducationCard
            experience={profile?.experience || []}
            education={profile?.education || []}
          />
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
