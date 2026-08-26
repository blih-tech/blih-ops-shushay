"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button, Input, PasswordInput, Alert, Spinner } from "@/components/ui";
import { Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";

const SKILLS_URL = process.env.NEXT_PUBLIC_SKILLS_URL || "http://localhost:3001";
const TALENT_URL = process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        user: { id: string; email: string; role: "TALENT" | "COMPANY" | "ADMIN" };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Successful login - determine redirect location
      if (returnTo) {
        window.location.href = returnTo;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-5">
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Email Address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        leftIcon={<Mail className="h-4 w-4" />}
      />

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider">
            Password
          </span>
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          isLoading={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </div>

      <div className="text-center pt-3 font-sans">
        <p className="text-sm sm:text-base text-muted-foreground">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your email and password to access your dashboard"
    >
      <Suspense fallback={<div className="text-center py-4 text-sm text-muted-foreground flex justify-center items-center gap-2"><Spinner size="sm" /> Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
