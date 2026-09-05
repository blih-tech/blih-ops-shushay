"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, ShieldCheck, AlertCircle, Loader2, Calendar, Clock } from "lucide-react";
import { Button, Badge, Card, Alert } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  getCompanySubscriptionStatus,
  initializeCompanySubscription,
} from "@blih/api-client";

function CompanySubscriptionContent() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<{
    hasActiveSubscription: boolean;
    subscription: {
      id: string;
      plan: "MONTHLY" | "YEARLY";
      status: "ACTIVE" | "EXPIRED";
      amount: number;
      currency: string;
      startDate: string;
      expiresAt: string;
    } | null;
    expiresAt: string | null;
    daysRemaining: number;
  } | null>(null);

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    setStatusError(null);
    try {
      const data = await getCompanySubscriptionStatus();
      setStatusData(data);
    } catch (err: any) {
      setStatusError(err.message || "Failed to fetch subscription status");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSubscribe = async (plan: "MONTHLY" | "YEARLY") => {
    setCheckoutLoading(plan);
    setCheckoutError(null);
    try {
      const res = await initializeCompanySubscription(plan);
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        setCheckoutError("Could not retrieve payment checkout URL. Please try again.");
      }
    } catch (err: any) {
      setCheckoutError(err.message || "Failed to initialize payment checkout.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const perks = [
    "Unlimited candidate search & directory filtering",
    "Inspect full candidate contact info (Email, Phone, Location)",
    "Download candidate CVs, portfolios, and code deliverables",
    "Post unlimited active job listings with skill threshold criteria",
    "Direct candidate messaging and application review status",
    "Verified graduate certificate inspection",
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
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
          Gain full access to the graduate evidence catalog, direct contact information, and unlimited role postings.
        </p>
      </div>

      {/* Current Active or Expired Subscription Card */}
      {!loadingStatus && statusData && (
        <div className="max-w-4xl mx-auto">
          {statusData.hasActiveSubscription && statusData.subscription ? (
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-[#F4FAF6] to-white border border-[#BDE8D0] shadow-sm rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D5F0E1] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#2E8F79] text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase">
                      ACTIVE SUBSCRIPTION
                    </span>
                    <Badge variant="primary">
                      {statusData.subscription.plan} PLAN
                    </Badge>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#17131F]">
                    Your Company Account is Active
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#2E8F79] font-semibold bg-[#E6F6ED] px-4 py-2 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>Full Access Granted</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#6E6678]">
                  <Calendar className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                  <div>
                    <span className="block font-semibold text-[#17131F]">Start Date</span>
                    <span>{new Date(statusData.subscription.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6E6678]">
                  <Calendar className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                  <div>
                    <span className="block font-semibold text-[#17131F]">Expiration Date</span>
                    <span>{new Date(statusData.subscription.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6E6678]">
                  <Clock className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                  <div>
                    <span className="block font-semibold text-[#17131F]">Time Remaining</span>
                    <span className="font-bold text-[#2E8F79]">
                      {statusData.daysRemaining} {statusData.daysRemaining === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ) : statusData.subscription ? (
            <Card className="p-6 sm:p-8 bg-[#FDF2F2] border border-[#F8C8C8] shadow-sm rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#EF4444] text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase">
                      SUBSCRIPTION EXPIRED
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#17131F]">
                    Your Company Subscription Has Expired
                  </h2>
                  <p className="text-xs text-[#6E6678]">
                    Expired on {new Date(statusData.subscription.expiresAt).toLocaleDateString()}. Talent search and job postings are currently blocked. Renew below to restore full access immediately.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#EF4444] font-semibold bg-[#FEE2E2] px-4 py-2 rounded-2xl shrink-0">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Access Blocked</span>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      )}

      {/* Global Checkout Error Alert */}
      {checkoutError && (
        <div className="max-w-4xl mx-auto">
          <Alert variant="error" className="text-sm">
            {checkoutError}
          </Alert>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="text-center">
        <div className="inline-flex flex-wrap p-1 bg-[#EEF3FF] border border-[#D9CEDF] rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${billingCycle === "monthly"
              ? "bg-[#1E5BFF] text-white shadow-xs"
              : "text-[#6E6678] hover:text-[#17131F]"
              }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${billingCycle === "yearly"
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
          className={`border rounded-3xl p-8 bg-white flex flex-col justify-between transition-all ${billingCycle === "monthly"
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
              onClick={() => handleSubscribe("MONTHLY")}
              disabled={Boolean(checkoutLoading)}
            >
              {checkoutLoading === "MONTHLY" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to Chapa...
                </span>
              ) : statusData?.hasActiveSubscription ? (
                "Renew / Extend Monthly Plan"
              ) : (
                "Choose Monthly Plan"
              )}
            </Button>
          </div>
        </Card>

        {/* Yearly Plan */}
        <Card
          className={`border rounded-3xl p-8 bg-white flex flex-col justify-between transition-all ${billingCycle === "yearly"
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
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => handleSubscribe("YEARLY")}
              disabled={Boolean(checkoutLoading)}
            >
              {checkoutLoading === "YEARLY" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to Chapa...
                </span>
              ) : statusData?.hasActiveSubscription ? (
                "Renew / Extend Annual Plan"
              ) : (
                "Choose Annual Plan"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function CompanySubscriptionPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanySubscriptionContent />
    </AuthGuard>
  );
}
