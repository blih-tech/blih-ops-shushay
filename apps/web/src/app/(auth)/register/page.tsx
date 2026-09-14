"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Alert } from "@blih/ui";
import { apiFetch } from "@/lib/api";
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

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-4">
        <div className="bg-white border border-[#D9CEDF] p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-[0_16px_50px_rgba(30,91,255,0.06)]">
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full">
        {/* Left Column: Intro & Benefits */}
        <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F] leading-tight">
              Build proof of skill. <br />
              Compete for better work.
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
              Create a free BLIH OPS account to learn, build a verified profile,
              discover opportunities and apply with evidence.
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
    </div>
  );
}
