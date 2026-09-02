import React, { Suspense } from "react";
import Link from "next/link";
import { Badge, Spinner } from "@blih/ui";
import { TALENT_URL } from "@/lib/urls";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="bg-white/90 backdrop-blur-md border border-[#D9CEDF] rounded-2xl sm:rounded-3xl px-6 py-3.5 flex justify-between items-center shadow-[0_8px_30px_rgba(23,19,31,0.04)]">
          <Link href={TALENT_URL} className="flex items-baseline gap-2 group">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF] group-hover:opacity-90 transition-opacity">
              BLIH OPS
            </span>
          </Link>
          <Link
            href="/register"
            className="font-mono text-xs font-medium uppercase tracking-wider text-[#6E6678] hover:text-[#1E5BFF] transition-colors px-4 py-2 border border-[#D9CEDF] hover:border-[#1E5BFF]/30 rounded-xl cursor-pointer bg-white"
          >
            New to BLIH OPS? <span className="text-[#1E5BFF] underline underline-offset-3"> Create account</span>
          </Link>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column: Value Panel */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F] leading-tight">
                Pick up where your skills and opportunities meet.
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
                Sign in to continue learning, update your evidence, apply to
                matched opportunities and manage Talent Pro.
              </p>
            </div>

            {/* Next Best Move Preview Card */}
            <div className="bg-gradient-to-br from-[#EEF3FF] via-white to-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
              <Badge variant="primary" size="sm">
                NEXT BEST MOVE
              </Badge>
              <h3 className="font-display text-xl font-bold text-[#17131F]">
                Complete Testing Evidence
              </h3>
              <p className="font-sans text-sm text-[#6E6678] leading-relaxed">
                Could strengthen your match for 3 opportunities this week.
              </p>
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#D9CEDF] p-8 sm:p-10 rounded-3xl shadow-[0_16px_50px_rgba(30,91,255,0.06)] space-y-6">
              <div className="space-y-1">
                <h2 className="font-display text-3xl font-bold text-[#17131F]">
                  Sign in
                </h2>
                <p className="font-sans text-sm text-[#6E6678]">
                  Access your BLIH OPS learning, profile evidence and
                  opportunity workspace.
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="text-center py-8 text-sm text-[#6E6678] flex justify-center items-center gap-2">
                    <Spinner size="sm" /> Loading sign in...
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}
