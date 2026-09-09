"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Alert } from "@blih/ui";
import { apiFetch } from "@/lib/api";
import { TALENT_URL } from "@/lib/urls";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const navHeader = (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="bg-white/90 backdrop-blur-md border border-[#D9CEDF] rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center gap-3 sm:gap-4 shadow-[0_8px_30px_rgba(23,19,31,0.04)]">
        <Link
          href={TALENT_URL}
          className="flex items-baseline gap-2 group shrink-0"
        >
          <span className="font-display text-xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF] group-hover:opacity-90 transition-opacity whitespace-nowrap">
            BLIH OPS
          </span>
        </Link>
        <Link
          href="/login"
          className="font-mono text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[#6E6678] hover:text-[#1E5BFF] transition-colors px-2.5 sm:px-4 py-1.5 sm:py-2 border border-[#D9CEDF] hover:border-[#1E5BFF]/30 rounded-xl cursor-pointer bg-white whitespace-nowrap shrink-0"
        >
          Already have an account?{" "}
          <span className="text-[#1E5BFF] underline underline-offset-3">
            Sign in
          </span>
        </Link>
      </div>
    </header>
  );

  const footerSection = (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-auto">
      <p>© 2026 BLIH OPS. All rights reserved.</p>
      <div className="flex gap-4 uppercase tracking-wider">
        <a className="hover:text-[#1E5BFF] transition-colors" href="#">
          Privacy Policy
        </a>
        <span className="text-[#D9CEDF]">·</span>
        <a className="hover:text-[#1E5BFF] transition-colors" href="#">
          Terms of Service
        </a>
        <span className="text-[#D9CEDF]">·</span>
        <a className="hover:text-[#1E5BFF] transition-colors" href="#">
          Support
        </a>
      </div>
    </footer>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />
        {navHeader}
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-16">
          <div className="w-full max-w-md bg-white border border-[#D9CEDF] p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-[0_16px_50px_rgba(30,91,255,0.06)]">
            <Alert variant="success" title="Check your email">
              {
                "We've sent you a link to verify your account. For local development, check the **blih-api** server console logs to retrieve the mock verification link."
              }
            </Alert>
            <div className="pt-4">
              <Link href="/login">
                <Button fullWidth size="lg">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
        {footerSection}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />
      {navHeader}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full">
          {/* Left Column: Intro & Benefits */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F] leading-tight">
                Build proof of skill. <br />
                Compete for better work.
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
                Create a free BLIH OPS account to learn, build a verified
                profile, discover opportunities and apply with evidence.
              </p>
            </div>

            {/* 3 Step Benefits */}
            <div className="space-y-4 pt-2">
              <div className="bg-white border border-[#D9CEDF] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#17131F]">
                    Learn
                  </h3>
                  <p className="font-sans text-sm text-[#6E6678]">
                    Access course discovery and learning paths
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#D9CEDF] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#17131F]">
                    Prove
                  </h3>
                  <p className="font-sans text-sm text-[#6E6678]">
                    Attach projects, assessments and certificates
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#D9CEDF] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#17131F]">
                    Apply
                  </h3>
                  <p className="font-sans text-sm text-[#6E6678]">
                    Use your profile evidence in opportunity applications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            <RegisterForm
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </main>

      {footerSection}
    </div>
  );
}
