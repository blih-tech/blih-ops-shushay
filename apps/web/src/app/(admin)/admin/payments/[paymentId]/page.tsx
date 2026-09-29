"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { fetchAdminPaymentById } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";

import { PaymentDetailHeader } from "@/components/admin/payment-detail/PaymentDetailHeader";
import { PaymentDetailStats } from "@/components/admin/payment-detail/PaymentDetailStats";
import { PaymentReceiptCard } from "@/components/admin/payment-detail/PaymentReceiptCard";
import { PaymentDetailSidebar } from "@/components/admin/payment-detail/PaymentDetailSidebar";

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
      } catch (err: unknown) {
        setError(
          getErrorMessage(err) || "Failed to load payment transaction details",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [paymentId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading payment transaction...
          </p>
        </div>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">
          {error || "Payment transaction record not found."}
        </Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <PaymentDetailHeader payment={payment} />

      {/* 4 Metric Cards */}
      <PaymentDetailStats payment={payment} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Transaction Receipt & Clearance */}
        <div className="lg:col-span-8">
          <PaymentReceiptCard payment={payment} />
        </div>

        {/* Right Column (4 cols): Payer Account & Gateway Details */}
        <div className="lg:col-span-4">
          <PaymentDetailSidebar payment={payment} />
        </div>
      </div>
    </main>
  );
}

export default function AdminPaymentDetailPage() {
  usePageTitle("Payment Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminPaymentDetailContent />
    </AuthGuard>
  );
}
