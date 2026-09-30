"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { fetchAdminSubscriptionById } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";
import type { AdminSubscriptionDetail } from "@/types/admin";

import { SubscriptionDetailHeader } from "@/components/admin/subscription-detail/SubscriptionDetailHeader";
import { SubscriptionDetailStats } from "@/components/admin/subscription-detail/SubscriptionDetailStats";
import { SubscriptionPlanCard } from "@/components/admin/subscription-detail/SubscriptionPlanCard";
import { SubscriptionPaymentCard } from "@/components/admin/subscription-detail/SubscriptionPaymentCard";
import { SubscriptionDetailSidebar } from "@/components/admin/subscription-detail/SubscriptionDetailSidebar";

function AdminSubscriptionDetailContent() {
  const params = useParams();
  const subId = params.subId as string;

  const [subscription, setSubscription] = useState<AdminSubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminSubscriptionById(subId);
        setSubscription(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "Failed to load subscription details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading subscription details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !subscription) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Subscription record not found."}</Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <SubscriptionDetailHeader subscription={subscription} />

      {/* 4 Metric Cards */}
      <SubscriptionDetailStats subscription={subscription} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Plan Terms & Linked Payment */}
        <div className="lg:col-span-8 space-y-6">
          <SubscriptionPlanCard subscription={subscription} />
          <SubscriptionPaymentCard payment={subscription.payment} />
        </div>

        {/* Right Column (4 cols): Subscriber Company & Lifecycle Details */}
        <div className="lg:col-span-4">
          <SubscriptionDetailSidebar subscription={subscription} />
        </div>
      </div>
    </main>
  );
}

export default function AdminSubscriptionDetailPage() {
  usePageTitle("Subscription Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminSubscriptionDetailContent />
    </AuthGuard>
  );
}
