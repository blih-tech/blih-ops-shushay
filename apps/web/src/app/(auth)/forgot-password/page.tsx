"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button, Input, Alert } from "@blih/ui";
import { Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Reset email sent"
        subtitle="Please check your inbox to reset your password"
      >
        <div className="text-center space-y-4 font-sans">
          <p className="text-sm sm:text-base text-[#17131F]">
            If the email address `{email}` exists in our system, a message
            containing a password reset link has been dispatched.
          </p>
          <p className="text-xs sm:text-sm text-[#6E6678]">
            In development, check the **blih-api** server console logs to
            retrieve the mock password reset link.
          </p>
          <div className="pt-4 border-t border-[#D9CEDF] mt-4">
            <Link
              href="/login"
              className="text-sm sm:text-base font-medium text-[#1E5BFF] hover:underline cursor-pointer"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a recovery link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            {loading ? "Sending link..." : "Send recovery link"}
          </Button>
        </div>

        <div className="text-center pt-3 font-sans">
          <Link
            href="/login"
            className="text-sm sm:text-base font-semibold text-[#1E5BFF] hover:underline cursor-pointer"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
