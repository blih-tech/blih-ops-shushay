"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, PasswordInput, Alert } from "@blih/ui";
import { Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { TALENT_URL, API_URL } from "@/lib/urls";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { useAuth } from "@/providers/AuthProvider";

function toPath(url: string): string {
  if (!url) return "/";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search + parsed.hash || "/";
    } catch {
      return url;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
}

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
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

      if (typeof window !== "undefined") {
        localStorage.setItem("blih_user_session", JSON.stringify(data.user));
      }
      await refresh();

      // Successful login - determine redirect location
      if (returnTo) {
        const { role } = data.user;
        let finalUrl = returnTo;
        try {
          const parsed = new URL(returnTo, TALENT_URL);
          const path = parsed.pathname;

          if (role === "ADMIN") {
            const isTalentOnly =
              path === "/profile" ||
              path.startsWith("/profile/") ||
              path === "/jobs" ||
              path.startsWith("/jobs/") ||
              path === "/applications" ||
              path.startsWith("/applications/");
            if (isTalentOnly) {
              finalUrl = `${TALENT_URL}/`;
            }
          } else if (role === "COMPANY") {
            const isTalentOnly =
              path === "/profile" ||
              path.startsWith("/profile/") ||
              path === "/jobs" ||
              path.startsWith("/jobs/") ||
              path === "/applications" ||
              path.startsWith("/applications/");
            if (isTalentOnly) {
              finalUrl = `${TALENT_URL}/`;
            }
          } else if (role === "TALENT") {
            const isCompanyOnly =
              path === "/company" || path.startsWith("/company/");
            if (isCompanyOnly) {
              finalUrl = `${TALENT_URL}/`;
            }
          }
        } catch {
          finalUrl = `${TALENT_URL}/`;
        }
        router.push(toPath(finalUrl));
      } else {
        // Redirect all roles (TALENT, ADMIN, COMPANY) to the Explore landing page by default
        router.push("/");
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
          placeholder="mikeal@blih.example"
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
