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
} from "@/components/ui";
import { CertificateCanvas } from "@/components/certificates/CertificateCanvas";
import { useAuth } from "@/providers/AuthProvider";

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
