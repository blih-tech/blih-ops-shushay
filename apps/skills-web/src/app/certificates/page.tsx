"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Download, Share2, ArrowLeft, Award, Lock, Loader2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, Badge } from "@blih/ui";
import { CertificateCanvas } from "@/components/certificates/CertificateCanvas";
import { useAuth } from "@/providers/AuthProvider";
import { getUserCertificates, getCertificateDownloadUrl } from "@blih/api-client";

interface CertificateItem {
  id: string;
  courseId?: string;
  certificateNumber: string;
  issueDate: string;
  course: {
    id: string;
    title: string;
    description: string;
  };
}

function CertificatesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(courseIdParam);

  useEffect(() => {
    if (courseIdParam) {
      setActiveFilter(courseIdParam);
    }
  }, [courseIdParam]);

  useEffect(() => {
    let isMounted = true;

    const fetchCertificates = async () => {
      try {
        const res = await getUserCertificates();
        if (isMounted && res?.certificates) {
          const uniqueCerts = res.certificates.reduce(
            (acc: CertificateItem[], cert: CertificateItem) => {
              const titleKey = cert.course?.title?.trim() || cert.id;
              if (!acc.some((c) => (c.course?.title?.trim() || c.id) === titleKey)) {
                acc.push(cert);
              }
              return acc;
            },
            [],
          );
          setCertificates(uniqueCerts);
        }
      } catch (err) {
        console.error("Failed to fetch user certificates", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCertificates();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recipientName = user?.email
    ? user.email.split("@")[0].toUpperCase()
    : "TALENT MEMBER";

  const displayedCertificates = activeFilter
    ? certificates.filter((cert) => {
        const q = activeFilter.toLowerCase().trim();
        const courseId = (cert.course?.id || cert.courseId || "").toLowerCase();
        const certId = (cert.id || "").toLowerCase();
        const certNum = (cert.certificateNumber || "").toLowerCase();
        const title = (cert.course?.title || "").toLowerCase();
        return (
          courseId === q ||
          certId === q ||
          certNum === q ||
          title.includes(q) ||
          q.includes(courseId)
        );
      })
    : certificates;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Dashboard
          </Button>
        </Link>

        {displayedCertificates.length > 0 && (
          <div className="flex items-center gap-3">
            {activeFilter && certificates.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilter(null)}
              >
                Show All Certificates ({certificates.length})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              {copied ? "Link Copied!" : "Share Credential"}
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#D9CEDF] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
          <p className="text-sm font-mono text-[#6E6678]">
            Checking earned credential records...
          </p>
        </div>
      ) : certificates.length === 0 ? (
        /* Empty / Locked State when no course is completed */
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EEF3FF] border border-[#C5D7FF] flex items-center justify-center mx-auto text-[#1E5BFF]">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" size="sm">
              No Verified Credentials Yet
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
              Complete a Track to Earn Your Certificate
            </h2>
            <p className="font-sans text-sm text-[#6E6678] leading-relaxed">
              Digital credentials are automatically issued and cryptographically verified once you finish 100% of all lessons, quizzes, and practical exercises in a course track.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/courses">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Award className="w-5 h-5" />}
              >
                Browse Catalog & Start Learning
              </Button>
            </Link>
          </div>
        </div>
      ) : displayedCertificates.length === 0 ? (
        /* No certificates matched filter */
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 text-center space-y-4">
          <p className="text-sm font-mono text-[#6E6678]">
            No certificate record found matching this filter.
          </p>
          <Button variant="outline" size="sm" onClick={() => setActiveFilter(null)}>
            Show All ({certificates.length}) Certificates
          </Button>
        </div>
      ) : (
        /* Render Canvas for Filtered Course Certificate */
        <div className="space-y-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#2E8F79] bg-[#E6F5F0] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Verification Record</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Verified Digital Credentials ({displayedCertificates.length})
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              All certificates issued through Blih Skills are cryptographically verifiable and indexed on your talent profile.
            </p>
          </div>

          {displayedCertificates.map((cert) => (
            <div key={cert.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#6E6678]">
                  Certificate ID: {cert.certificateNumber}
                </span>
                <a
                  href={getCertificateDownloadUrl(cert.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Certificate</span>
                </a>
              </div>
              <CertificateCanvas
                recipientName={recipientName}
                courseName={cert.course.title}
                credentialId={cert.certificateNumber}
                issueDate={new Date(cert.issueDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                score={100}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function CertificatesPage() {
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#D9CEDF] space-y-3 max-w-5xl mx-auto my-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
            <p className="text-sm font-mono text-[#6E6678]">
              Loading credential record...
            </p>
          </div>
        }
      >
        <CertificatesContent />
      </Suspense>
    </AuthGuard>
  );
}
