"use client";

import React, { use, useRef, useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { Badge, Button, Card, Skeleton, Alert } from "@blih/ui";
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  FileText,
  Sparkles,
} from "lucide-react";
import { getTalentProfileById } from "@/lib/talentApi";
import { ApiError } from "@/lib/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TalentCredentialSections } from "@/components/profile/TalentCredentialSections";

gsap.registerPlugin(ScrollTrigger);

interface PageProps {
  params: Promise<{ talentId: string }>;
}

function CompanyTalentDetailsContent({ talentId }: { talentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [talent, setTalent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  useEffect(() => {
    async function loadTalent() {
      setLoading(true);
      setError(null);
      setSubscriptionRequired(false);
      try {
        const data = await getTalentProfileById(talentId);
        setTalent(data);
      } catch (err: any) {
        console.error("Error loading talent profile:", err);
        if (err instanceof ApiError && err.status === 402) {
          setSubscriptionRequired(true);
          setError(
            "An active company subscription is required to view full talent profiles.",
          );
        } else {
          setError(err?.message || "Failed to load candidate profile.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadTalent();
  }, [talentId]);

  useGSAP(
    () => {
      if (!talent) return;
      gsap.fromTo(
        ".reveal-profile-block",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [talent] },
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton variant="rectangular" width={180} height={20} className="rounded-md" />
        <Card className="p-8 space-y-4">
          <div className="flex gap-4">
            <Skeleton variant="rectangular" width={100} height={100} className="rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton variant="rectangular" width={250} height={28} className="rounded-md" />
              <Skeleton variant="rectangular" width={180} height={18} className="rounded-md" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (subscriptionRequired) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 font-sans">
        <Link
          href="/company/talents"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to talent directory
        </Link>
        <Card className="border border-[#1E5BFF]/30 bg-gradient-to-br from-white to-[#EEF3FF] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-md">
          <div className="w-14 h-14 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
              Subscription Required to View Profile
            </h2>
            <p className="text-sm text-[#6E6678] max-w-md mx-auto font-sans">
              Viewing complete candidate profiles, contacts, verified certificates, and project evidence requires an active company subscription.
            </p>
          </div>
          <Link href="/company/subscription" className="inline-block pt-2">
            <Button variant="primary" size="lg">
              Activate Subscription
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 font-sans">
        <Link
          href="/company/talents"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to talent directory
        </Link>
        <Alert variant="error" title={error || "Candidate Not Found"}>
          The requested talent profile could not be loaded or does not exist.
        </Alert>
      </div>
    );
  }

  const name = talent.fullName || "Candidate";
  const location = [talent.city, talent.country].filter(Boolean).join(", ");

  return (
    <div ref={containerRef} className="w-full font-sans selection:bg-[#DDE7FF]">
      {/* Sub-header Breadcrumb line */}
      <div className="border-b border-[#E6EAF3] py-4 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/company/talents"
            className="flex items-center gap-2 text-sm font-semibold text-[#1E5BFF] hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Talent</span>
          </Link>
          <Badge variant="verified">VERIFIED TALENT</Badge>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Card */}
        <section className="reveal-profile-block bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="w-[118px] h-[118px] rounded-full overflow-hidden border border-[#BFD0FF] shadow-xs shrink-0 bg-[#EEF3FF] relative flex items-center justify-center"
              style={{ width: "118px", height: "118px", minWidth: "118px", minHeight: "118px", maxWidth: "118px", maxHeight: "118px", borderRadius: "50%" }}
            >
              {talent.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={talent.photoUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-full"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <div className="w-full h-full bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-[34px] shadow-sm rounded-full">
                  {name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                  {name}
                </h1>
                {talent.status === "ACTIVE" && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-[#2E8F79] bg-[#E6F5F0] px-2.5 py-0.5 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Hire
                  </span>
                )}
              </div>

              <p className="font-sans text-base sm:text-lg font-semibold text-[#1E5BFF]">
                {talent.title || "Technical Specialist"}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6E6678] pt-1">
                {location && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-[#1E5BFF]" />
                    {location}
                  </span>
                )}
                {talent.englishLevel && (
                  <span>
                    English: <strong className="text-[#17131F]">{talent.englishLevel}</strong>
                  </span>
                )}
              </div>
            </div>

            {talent.cvUrl && (
              <a
                href={talent.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                  Download CV
                </Button>
              </a>
            )}
          </div>

          {/* Competency Chips */}
          <div className="space-y-4 pt-4 border-t border-[#D9CEDF]/70">
            {talent.skills && talent.skills.length > 0 && (
              <div className="space-y-2">
                <span className="font-sans text-xs font-bold text-[#6E6678] uppercase tracking-wider block">
                  Verified Skills & Core Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono font-medium text-[#1E5BFF]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {talent.bio && (
              <div className="space-y-2 pt-4 border-t border-[#E6EAF3]/75">
                <span className="font-sans text-xs font-bold text-[#6E6678] uppercase tracking-wider block">
                  Candidate Biography
                </span>
                <p className="font-sans text-base text-[#17131F] leading-relaxed whitespace-pre-line">
                  {talent.bio}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Modular Experience, Education & Certificates */}
        <TalentCredentialSections
          experience={talent.experience}
          education={talent.education}
          certificates={talent.certificates}
        />
      </main>
    </div>
  );
}

export default function CompanyTalentDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyTalentDetailsContent talentId={resolvedParams.talentId} />
    </AuthGuard>
  );
}
