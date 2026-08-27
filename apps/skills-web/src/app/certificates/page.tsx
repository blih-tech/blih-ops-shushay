"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  QrCode,
  ArrowLeft,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  GlobalNavbar,
  SkillBar,
} from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";

function CertificateCanvas({
  recipientName = "Sara Tesfaye",
  courseName = "React Product Systems & Architecture",
  issueDate = "August 2026",
  credentialId = "BLIH-CR-892401-VERIFIED",
  score = 94,
}: {
  recipientName?: string;
  courseName?: string;
  issueDate?: string;
  credentialId?: string;
  score?: number;
}) {
  return (
    <div className="w-full bg-gradient-to-br from-white via-[#EEF3FF]/60 to-white border-2 border-[#D9CEDF] rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(30,91,255,0.08)] relative overflow-hidden space-y-8">
      {/* Top watermark / branding */}
      <div className="flex items-center justify-between border-b border-[#D9CEDF]/80 pb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold tracking-tight text-[#1E5BFF]">
            Blih
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#6E6678]">
            Verified Digital Credential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="verified" size="md">
            Cryptographically Verified
          </Badge>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="text-center space-y-4 max-w-2xl mx-auto py-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#6E6678]">
          This certifies that
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#17131F] tracking-tight">
          {recipientName}
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#6E6678] leading-relaxed max-w-xl mx-auto">
          has successfully demonstrated production competency and passed all verified practical assessments in
        </p>
        <div className="py-2">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1E5BFF]">
            {courseName}
          </h3>
        </div>
      </div>

      {/* Competencies Verified */}
      <div className="bg-white/80 border border-[#D9CEDF] rounded-2xl p-6 max-w-xl mx-auto space-y-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E6678] block text-center">
          Verified Competency Breakdown
        </span>
        <SkillBar name="Architecture & State" score={score} status="Verified" variant="primary" />
        <SkillBar name="Practical Assessment" score={92} status="Verified" variant="verified" />
      </div>

      {/* Certificate Footer / Proof Signature */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#D9CEDF]/80 pt-6 gap-4 text-xs font-mono text-[#6E6678]">
        <div>
          <span className="block font-semibold text-[#17131F]">Issued by Blih Ops Evaluation</span>
          <span>Date: {issueDate}</span>
        </div>

        <div className="text-center sm:text-right">
          <span className="block font-semibold text-[#17131F]">Credential ID:</span>
          <span className="text-[#1E5BFF]">{credentialId}</span>
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Dashboard
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
                {copied ? "Link Copied!" : "Share Credential"}
              </Button>
              <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Download PDF Record
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#2E8F79] bg-[#E6F5F0] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Verification Record</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Verified Digital Credentials
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              All certificates issued through Blih Skills are cryptographically verifiable and indexed on your talent profile.
            </p>
          </div>

          {/* Certificate Render Canvas */}
          <CertificateCanvas
            recipientName={user?.email ? user.email.split("@")[0].toUpperCase() : "TALENT MEMBER"}
            courseName="React Product Systems & Enterprise Architecture"
            score={94}
          />
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
