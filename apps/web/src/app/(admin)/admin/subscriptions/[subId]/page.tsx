"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CreditCard, Building2 } from "lucide-react";
import { Alert, Badge, Button, MetricCard } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminSubscriptionById } from "@/lib/adminApi";

function AdminSubscriptionDetailContent() {
  const params = useParams();
  const subId = params.subId as string;

  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminSubscriptionById(subId);
        setSubscription(data);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [subId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[
            { label: "Subscriptions", href: "/admin/subscriptions" },
            { label: "Loading..." },
          ]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !subscription) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[
            { label: "Subscriptions", href: "/admin/subscriptions" },
            { label: "Error" },
          ]}
        />
        <Alert variant="error">{error || "Subscription not found"}</Alert>
      </main>
    );
  }

  const companyName =
    subscription.companyProfile?.companyName || "Unknown Company";

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      <AdminBreadcrumb
        items={[
          { label: "Subscriptions", href: "/admin/subscriptions" },
          { label: `${companyName} (${subscription.plan})` },
        ]}
      />

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard value={subscription.plan} label="Plan" variant="primary" />
        <MetricCard
          value={`${subscription.amount} ${subscription.currency}`}
          label="Amount"
          variant="surface"
        />
        <MetricCard
          value={new Date(subscription.startDate).toLocaleDateString()}
          label="Started"
          variant="surface"
        />
        <MetricCard
          value={
            subscription.expiresAt
              ? new Date(subscription.expiresAt).toLocaleDateString()
              : "Never"
          }
          label="Expires"
          variant="surface"
        />
      </div>

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {companyName}
                  </h1>
                  <AdminStatusBadge
                    type="subscription"
                    value={subscription.status}
                  />
                  <Badge variant="primary">{subscription.plan} PLAN</Badge>
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" />
                  Subscription Record
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Subscription Info */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
              Subscription Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">
                  Subscription ID
                </p>
                <p className="font-mono text-xs text-[#17131F] break-all mt-1">
                  {subscription.id}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">
                  Auto Renew
                </p>
                <p className="font-medium text-[#17131F] mt-1">
                  {subscription.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">
                  Created Date
                </p>
                <p className="font-medium text-[#17131F] mt-1">
                  {new Date(subscription.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Subscribed Company */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                Company Account
              </h2>
              {subscription.companyProfile?.id && (
                <Link
                  href={`/admin/companies/${subscription.companyProfile.id}`}
                >
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Company Profile →
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">
                  Company Name
                </p>
                <p className="font-medium text-[#17131F] mt-1">{companyName}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">
                  Account Email
                </p>
                <p className="font-medium text-[#17131F] mt-1">
                  {subscription.companyProfile?.user?.email || "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">
                  Location
                </p>
                <p className="font-medium text-[#17131F] mt-1">
                  {[
                    subscription.companyProfile?.city,
                    subscription.companyProfile?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Linked Payment */}
          {subscription.payment && (
            <div className="pt-8 space-y-4">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                Linked Payment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">
                    Transaction Ref
                  </p>
                  <p className="font-mono text-xs text-[#17131F] break-all mt-1">
                    {subscription.payment.txRef}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">
                    Payment Status
                  </p>
                  <div className="mt-1">
                    <AdminStatusBadge
                      type="payment"
                      value={subscription.payment.status}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs text-[#6E6678] uppercase">
                    Amount Charged
                  </p>
                  <p className="font-medium text-[#17131F] mt-1">
                    {subscription.payment.amount}{" "}
                    {subscription.payment.currency}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AdminSubscriptionDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminSubscriptionDetailContent />
    </AuthGuard>
  );
}
