"use client";

import React, { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button, Badge, Card, GlobalNavbar } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";

function CompanySubscriptionContent() {
  const { user, logout } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );

  const perks = [
    "Unlimited candidate search & directory filtering",
    "Inspect full candidate contact info (Email, Phone, Location)",
    "Download candidate CVs, portfolios, and code deliverables",
    "Post unlimited active job listings with skill threshold criteria",
    "Direct candidate messaging and application review status",
    "Verified graduate certificate inspection",
  ];

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="subscription" user={user} onSignOut={logout} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Company Subscription & Billing</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F]">
            Hire verified African engineering talent with confidence.
          </h1>
          <p className="text-base sm:text-lg text-[#6E6678] font-sans leading-relaxed">
            Gain full access to the graduate evidence catalog, direct contact
            information, and unlimited role postings.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex flex-wrap p-1 bg-[#EEF3FF] border border-[#D9CEDF] rounded-2xl gap-1 mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#1E5BFF] text-white shadow-xs"
                  : "text-[#6E6678] hover:text-[#17131F]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[#1E5BFF] text-white shadow-xs"
                  : "text-[#6E6678] hover:text-[#17131F]"
              }`}
            >
              <span>Yearly Plan</span>
              <span className="bg-[#2E8F79] text-white text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                SAVE 14,000 ETB
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Monthly Plan */}
          <Card
            className={`border rounded-3xl p-8 bg-white flex flex-col justify-between transition-all ${
              billingCycle === "monthly"
                ? "border-2 border-[#1E5BFF] shadow-lg"
                : "border-[#D9CEDF]"
            }`}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="default">FLEXIBLE</Badge>
                <h3 className="font-display text-2xl font-bold text-[#17131F]">
                  Monthly Hiring Pass
                </h3>
                <p className="text-xs text-[#6E6678]">
                  Month-to-month access to candidate directory.
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#17131F]">
                  2,000
                </span>
                <span className="font-mono text-sm text-[#6E6678]">
                  ETB / month
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#D9CEDF]/70">
                {perks.slice(0, 4).map((perk, pi) => (
                  <div
                    key={pi}
                    className="flex items-start gap-2.5 text-xs text-[#17131F] font-sans"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2E8F79] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6">
              <Button
                variant={billingCycle === "monthly" ? "primary" : "outline"}
                fullWidth
                size="lg"
              >
                Choose Monthly Plan
              </Button>
            </div>
          </Card>

          {/* Yearly Plan */}
          <Card
            className={`border rounded-3xl p-8 bg-white flex flex-col justify-between transition-all ${
              billingCycle === "yearly"
                ? "border-2 border-[#1E5BFF] shadow-xl relative"
                : "border-[#D9CEDF]"
            }`}
          >
            {billingCycle === "yearly" && (
              <div className="absolute -top-3.5 right-6 bg-[#1E5BFF] text-white text-[11px] font-mono uppercase px-3 py-1 rounded-full font-bold shadow-sm">
                RECOMMENDED
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="primary">BEST VALUE</Badge>
                <h3 className="font-display text-2xl font-bold text-[#17131F]">
                  Annual Enterprise License
                </h3>
                <p className="text-xs text-[#6E6678]">
                  Full unmetered 12-month access with priority support.
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#17131F]">
                  10,000
                </span>
                <span className="font-mono text-sm text-[#6E6678]">
                  ETB / year
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#D9CEDF]/70">
                {perks.map((perk, pi) => (
                  <div
                    key={pi}
                    className="flex items-start gap-2.5 text-xs text-[#17131F] font-sans"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2E8F79] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6">
              <Button variant="primary" fullWidth size="lg">
                Choose Annual Plan
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function CompanySubscriptionPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanySubscriptionContent />
    </AuthGuard>
  );
}
