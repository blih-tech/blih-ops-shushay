"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { Alert, Button, Spinner } from "@blih/ui";
import { apiFetch } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(token ? null : "Verification token is missing.");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    const performVerification = async () => {
      try {
        await apiFetch<{ message: string }>("/auth/verify-email", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "Email verification failed.");
      } finally {
        setLoading(false);
      }
    };

    performVerification();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-muted-foreground font-sans animate-pulse">
          Verifying your email address...
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <Alert variant="success" title="Email Verified">
          Your email has been verified successfully. You can now sign in to your account.
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
    <div className="text-center space-y-4">
      <Alert variant="error" title="Verification Failed">
        {error || "Verification link is invalid or has expired."}
      </Alert>
      <div className="pt-4">
        <Link
          href="/register"
          className="text-sm font-medium text-primary hover:underline cursor-pointer"
        >
          Try registering again
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verifying your account"
      subtitle="Please wait while we confirm your email verification"
    >
      <Suspense fallback={<div className="text-center py-4 text-sm text-muted-foreground flex justify-center items-center gap-2"><Spinner size="sm" /> Loading token...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
