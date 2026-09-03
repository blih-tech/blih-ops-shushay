"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Download, Share2, ArrowLeft, Award, Lock, Loader2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, GlobalNavbar, Badge } from "@blih/ui";
import { CertificateCanvas } from "@/components/certificates/CertificateCanvas";
import { useAuth } from "@/providers/AuthProvider";
import { getUserCertificates, getCertificateDownloadUrl } from "@blih/api-client";

interface CertificateItem {
  id: string;
  certificateNumber: string;
  issueDate: string;
  course: {
    id: string;
    title: string;
    description: string;
  };
}

export default function CertificatesPage() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCertificates = async () => {
      try {
        const res = await getUserCertificates();
        if (isMounted && res?.certificates) {
          setCertificates(res.certificates);
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

  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

        {/* Global Navbar */}
        <GlobalNavbar
          currentApp="skills"
          user={user ? { email: user.email, role: user.role } : null}
          onSignOut={logout}
        />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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

            {certificates.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  {copied ? "Link Copied!" : "Share Credential"}
                </Button>
                <a
                  href={getCertificateDownloadUrl(certificates[0].id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Download PDF Record
                  </Button>
                </a>
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
          ) : (
            /* Render Canvas for Each Completed Course Certificate */
            <div className="space-y-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#2E8F79] bg-[#E6F5F0] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Public Verification Record</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                  Verified Digital Credentials ({certificates.length})
                </h1>
                <p className="font-sans text-sm sm:text-base text-[#6E6678]">
                  All certificates issued through Blih Skills are cryptographically verifiable and indexed on your talent profile.
                </p>
              </div>

              {certificates.map((cert) => (
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

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-12">
          <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
          <div className="flex gap-4 uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-[#1E5BFF]">
              Dashboard
            </Link>
            <span className="text-[#D9CEDF]">·</span>
            <Link href="/courses" className="hover:text-[#1E5BFF]">
              Courses
            </Link>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
