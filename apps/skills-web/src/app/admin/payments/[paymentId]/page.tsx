"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Alert, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminPaymentById } from "@/lib/adminApi";

function AdminPaymentDetailContent() {
  const params = useParams();
  const paymentId = params.paymentId as string;

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminPaymentById(paymentId);
        setPayment(data);
      } catch (err: any) {
        setError(err.message || "Failed to load payment transaction details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [paymentId]);

  if (loading) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[{ label: "Payments", href: "/admin/payments" }, { label: "Loading..." }]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[{ label: "Payments", href: "/admin/payments" }, { label: "Error" }]}
        />
        <Alert variant="error">{error || "Payment transaction not found"}</Alert>
      </main>
    );
  }

  const userDisplayName =
    payment.user?.talentProfile?.fullName ||
    payment.user?.companyProfile?.companyName ||
    payment.user?.email ||
    "Unknown User";

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Payments", href: "/admin/payments" },
          { label: payment.txRef || "Transaction" },
        ]}
      />

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center shrink-0">
                <CreditCard className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {payment.amount} {payment.currency}
                  </h1>
                  <AdminStatusBadge type="payment" value={payment.status} />
                  <AdminStatusBadge type="paymentType" value={payment.paymentType} />
                </div>
                <p className="text-sm font-mono text-[#6E6678] flex items-center gap-2">
                  Tx Ref: {payment.txRef}
                </p>
              </div>
            </div>
          </div>

          {/* Integrated Stat Strip */}
          <div className="mt-6 pt-6 border-t border-[#EBE5F0] grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Amount Charged</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {payment.amount} {payment.currency}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Status</p>
              <div className="mt-1">
                <AdminStatusBadge type="payment" value={payment.status} />
              </div>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Payment Purpose</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {payment.paymentType}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6E6678] uppercase">Transaction Date</p>
              <p className="font-display font-semibold text-[#17131F] mt-0.5">
                {new Date(payment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Details */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-base text-[#17131F]">Transaction Reference Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Internal Payment ID</p>
                <p className="font-mono text-xs text-[#17131F] break-all mt-1">{payment.id}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Chapa Tx Reference</p>
                <p className="font-mono text-xs text-[#17131F] break-all mt-1">{payment.txRef}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Timestamp</p>
                <p className="font-medium text-[#17131F] mt-1">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payer */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-[#17131F]">Payer Account</h2>
              {payment.user?.id && (
                <Link href={`/admin/users/${payment.user.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Payer Account →
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Entity / Payer Name</p>
                <p className="font-medium text-[#17131F] mt-1">{userDisplayName}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Account Email</p>
                <p className="font-medium text-[#17131F] mt-1">{payment.user?.email || "—"}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Role</p>
                <p className="font-medium text-[#17131F] mt-1">{payment.user?.role || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminPaymentDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminPaymentDetailContent />
    </AuthGuard>
  );
}
