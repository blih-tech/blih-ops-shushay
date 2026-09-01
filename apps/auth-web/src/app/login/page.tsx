"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Input, PasswordInput, Alert, Badge, Spinner } from "@blih/ui";
import { Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";

const SKILLS_URL =
  process.env.NEXT_PUBLIC_SKILLS_URL || "http://localhost:3001";
const TALENT_URL =
  process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const googleError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        user: {
          id: string;
          email: string;
          role: "TALENT" | "COMPANY" | "ADMIN";
        };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Successful login - determine redirect location
      // Successful login - determine redirect location
      if (returnTo) {
        const { role } = data.user;
        let finalUrl = returnTo;
        try {
          const parsed = new URL(returnTo, TALENT_URL);
          const path = parsed.pathname;

          if (role === "COMPANY") {
            const isTalentOnly =
              path === "/profile" ||
              path.startsWith("/profile/") ||
              path === "/jobs" ||
              path.startsWith("/jobs/") ||
              path === "/applications" ||
              path.startsWith("/applications/");
            if (isTalentOnly) {
              finalUrl = `${TALENT_URL}/company`;
            }
          } else if (role === "TALENT") {
            const isCompanyOnly =
              path === "/company" || path.startsWith("/company/");
            if (isCompanyOnly) {
              finalUrl = `${TALENT_URL}/profile`;
            }
          }
        } catch {
          finalUrl =
            role === "COMPANY"
              ? `${TALENT_URL}/company`
              : `${TALENT_URL}/profile`;
        }
        window.location.href = finalUrl;
      } else {
        const { role } = data.user;
        if (role === "ADMIN") {
          window.location.href = `${SKILLS_URL}/admin`;
        } else if (role === "COMPANY") {
          window.location.href = `${TALENT_URL}/company`;
        } else {
          window.location.href = `${TALENT_URL}/profile`;
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const params = new URLSearchParams({ role: "TALENT" });
    if (returnTo) params.set("returnTo", returnTo);
    window.location.href = `${API_URL}/auth/google?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {(error || googleError) && (
        <Alert variant="error">{error || googleError}</Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="sara@blih.example"
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6E6678]">
              Password
            </span>
            <Link
              href="/forgot-password"
              className="text-xs font-mono text-[#1E5BFF] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#D9CEDF]/70 w-full" />
        <span className="bg-white px-3 font-sans text-xs text-[#6E6678] uppercase absolute">
          or
        </span>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#D9CEDF] bg-white hover:bg-[#EEF3FF]/60 hover:border-[#1E5BFF]/30 transition-all text-sm font-sans font-semibold text-[#17131F] cursor-pointer shadow-sm active:scale-[0.99]"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      {/* Security Note */}
      <p className="font-sans text-xs text-[#6E6678] text-center leading-relaxed pt-2">
        Protected sign-in. Employers only see public profile information and
        evidence you choose to share.
      </p>
    </div>
  );
}

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
            New to BLIH OPS? Create account
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
