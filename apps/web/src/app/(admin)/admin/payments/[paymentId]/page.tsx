"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CreditCard, User, Calendar, Tag, Hash } from "lucide-react";
import { Alert, Button, MetricCard } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
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
      <main className="w-full px-6 py-6 space-y-6">

        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="w-full px-6 py-6 space-y-4">

        <Alert variant="error">
          {error || "Payment transaction not found"}
        </Alert>
      </main>
    );
  }

  const userDisplayName =
    payment.user?.talentProfile?.fullName ||
    payment.user?.companyProfile?.companyName ||
    payment.user?.email ||
    "Unknown User";

  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <main className="w-full px-6 py-6 space-y-4">


      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          value={`${payment.amount} ${payment.currency}`}
          label="Amount"
          variant="primary"
        />
        <MetricCard value={payment.status} label="Status" variant="surface" />
        <MetricCard
          value={payment.paymentType.replace(/_/g, " ")}
          label="Purpose"
          variant="surface"
        />
        <MetricCard
          value={new Date(payment.createdAt).toLocaleDateString()}
          label="Date"
          variant="surface"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Header — hero amount + inline data row */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0]">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center shrink-0">
              <CreditCard className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {payment.amount}{" "}
                    <span className="text-lg font-semibold text-[#6E6678]">
                      {payment.currency}
                    </span>
                  </h1>
                  <AdminStatusBadge type="payment" value={payment.status} />
                  <AdminStatusBadge
                    type="paymentType"
                    value={payment.paymentType}
                  />
                </div>
              </div>

              {/* Inline data chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                  <Hash className="h-3 w-3 shrink-0" />
                  <span
                    className="font-mono truncate max-w-[160px]"
                    title={payment.txRef}
                  >
                    {payment.txRef}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  {new Date(payment.createdAt).toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#6E6678] bg-[#F9F8FC] border border-[#EBE5F0] rounded-xl px-3 py-1.5">
                  <Tag className="h-3 w-3 shrink-0" />
                  {payment.paymentType.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="divide-y divide-[#EBE5F0]">
          {/* Transaction Reference */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
              Transaction Reference
            </h2>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F9F8FC]">
                <span className="text-xs text-[#6E6678] shrink-0 pt-0.5 w-36">
                  Internal Payment ID
                </span>
                <code className="font-mono text-xs text-[#17131F] bg-[#F9F8FC] border border-[#EBE5F0] px-2.5 py-1.5 rounded-lg break-all text-right">
                  {payment.id}
                </code>
              </div>
              <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F9F8FC]">
                <span className="text-xs text-[#6E6678] shrink-0 pt-0.5 w-36">
                  Chapa Tx Reference
                </span>
                <code className="font-mono text-xs text-[#17131F] bg-[#F9F8FC] border border-[#EBE5F0] px-2.5 py-1.5 rounded-lg break-all text-right">
                  {payment.txRef}
                </code>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-xs text-[#6E6678] w-36">Timestamp</span>
                <span className="text-sm font-medium text-[#17131F]">
                  {new Date(payment.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payer Account */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-sm text-[#6E6678] uppercase tracking-wider">
                Payer Account
              </h2>
              {payment.user?.id && (
                <Link href={`/admin/users/${payment.user.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    View Account →
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#F9F8FC] rounded-2xl border border-[#EBE5F0]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-base shrink-0">
                {payment.user?.talentProfile?.photoUrl ||
                payment.user?.companyProfile?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      payment.user.talentProfile?.photoUrl ||
                      payment.user.companyProfile?.logoUrl
                    }
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="font-medium text-[#17131F] text-sm truncate">
                  {userDisplayName}
                </p>
                <p className="text-xs text-[#6E6678] truncate">
                  {payment.user?.email || "—"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[#6E6678]">Role</p>
                <p className="text-sm font-medium text-[#17131F]">
                  {payment.user?.role || "—"}
                </p>
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
