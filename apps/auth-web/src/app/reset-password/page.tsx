"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button, PasswordInput, Alert, Spinner } from "@/components/ui";
import { apiFetch } from "@/lib/api";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
    } catch (err: any) {
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 font-sans">
        <Alert variant="success">
          Your password has been reset successfully. You can now use your new password to sign in.
        </Alert>
        <div className="pt-4">
          <Link href="/login">
            <Button fullWidth>Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      {!token && (
        <Alert variant="warning">
          Warning: Reset token is missing from the URL. You will not be able to submit this form.
        </Alert>
      )}

      <PasswordInput
        label="New Password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <PasswordInput
        label="Confirm New Password"
        required
        minLength={6}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
      />

      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          disabled={!token}
          isLoading={loading}
        >
          {loading ? "Resetting password..." : "Reset password"}
        </Button>
      </div>

      <div className="text-center pt-3 font-sans">
        <Link
          href="/login"
          className="text-sm sm:text-base font-semibold text-primary hover:underline cursor-pointer"
        >
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create new password"
      subtitle="Enter and confirm your new password below"
    >
      <Suspense fallback={<div className="text-center py-4 text-sm text-muted-foreground flex justify-center items-center gap-2"><Spinner size="sm" /> Loading token...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
