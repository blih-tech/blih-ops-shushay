"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button, Badge, GlobalNavbar } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";

interface PageProps {
  params: Promise<{ companyId: string }>;
}

function CompanyProfileContent({ companyId }: { companyId: string }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="opportunities" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
        </Link>

        {/* Company Header Card */}
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF] font-display font-bold text-2xl shrink-0">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                    Hiring Organization
                  </h1>
                  <Badge variant="verified">Verified Employer</Badge>
                </div>
                <p className="text-xs font-mono text-[#6E6678]">
                  Company ID: {companyId}
                </p>
              </div>
            </div>

            <Link href="/jobs">
              <Button size="md" variant="outline">
                View Open Positions
              </Button>
            </Link>
          </div>

          <p className="text-sm text-[#6E6678] leading-relaxed font-sans pt-2 border-t border-[#D9CEDF]/60">
            A fast-growing engineering group building evidence-backed digital
            products and distributed infrastructure across Africa and globally.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function CompanyProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT", "COMPANY", "ADMIN"]}>
      <CompanyProfileContent companyId={resolvedParams.companyId} />
    </AuthGuard>
  );
}
