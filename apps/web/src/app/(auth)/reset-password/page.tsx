"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button, PasswordInput, Alert, Spinner } from "@blih/ui";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@blih/api-client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="error" title="Invalid Request">
          Missing password reset token. Please check the link from your email or
          request a new one.
        </Alert>
        <div className="pt-2">
          <Link href="/forgot-password">
            <Button variant="outline" fullWidth>
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "An error occurred. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 font-sans">
        <Alert variant="success" title="Password Reset Complete">
          Your password has been successfully updated. You can now sign in with
          your new credentials.
        </Alert>
        <div className="pt-4">
          <Link href="/login">
            <Button fullWidth size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <PasswordInput
        label="New Password"
        required
        minLength={6}
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        placeholder="••••••••"
      />

      <PasswordInput
        label="Confirm New Password"
        required
        minLength={6}
        value={confirmPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfirmPassword(e.target.value)
        }
        placeholder="••••••••"
      />

      <div className="pt-2">
        <Button type="submit" fullWidth size="lg" isLoading={loading}>
          {loading ? "Resetting password..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create new password"
      subtitle="Enter a new secure password for your Blih account"
    >
      <Suspense
        fallback={
          <div className="text-center py-4 text-sm text-[#6E6678] flex justify-center items-center gap-2">
            <Spinner size="sm" /> Loading form...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
