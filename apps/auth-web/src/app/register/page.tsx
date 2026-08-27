"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Alert } from "@/components/ui";
import { apiFetch } from "@/lib/api";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

import { RegisterForm } from "@/components/RegisterForm";

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
      <div className="bg-white/90 backdrop-blur-md border border-[#D9CEDF] rounded-2xl sm:rounded-3xl px-6 py-3.5 flex justify-between items-center shadow-[0_8px_30px_rgba(23,19,31,0.04)]">
        <Link href="http://localhost:3002" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF] group-hover:opacity-90 transition-opacity">
            BLIH OPS
          </span>
        </Link>
        <Link
          href="/login"
          className="font-mono text-xs font-medium uppercase tracking-wider text-[#6E6678] hover:text-[#1E5BFF] transition-colors px-4 py-2 border border-[#D9CEDF] hover:border-[#1E5BFF]/30 rounded-xl cursor-pointer bg-white"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </header>
  );

  const footerSection = (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-auto">
      <p>© 2026 BLIH OPS. All rights reserved.</p>
      <div className="flex gap-4 uppercase tracking-wider">
        <a className="hover:text-[#1E5BFF] transition-colors" href="#">Privacy Policy</a>
        <span className="text-[#D9CEDF]">·</span>
        <a className="hover:text-[#1E5BFF] transition-colors" href="#">Terms of Service</a>
        <span className="text-[#D9CEDF]">·</span>
        <a className="hover:text-[#1E5BFF] transition-colors" href="#">Support</a>
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
              {"We've sent you a link to verify your account. For local development, check the **blih-api** server console logs to retrieve the mock verification link."}
            </Alert>
            <div className="pt-4">
              <Link href="/login">
                <Button fullWidth size="lg">Go to Sign In</Button>
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
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F] leading-tight">
                Build proof of skill. <br />
                Compete for better work.
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
                Create a free BLIH OPS account to learn, build a verified profile, discover opportunities and apply with evidence.
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
          <div className="lg:col-span-6 flex justify-center">
            <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
          </div>
        </div>
      </main>

      {footerSection}
    </div>
  );
}
