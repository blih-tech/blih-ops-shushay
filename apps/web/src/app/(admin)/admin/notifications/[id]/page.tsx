"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Spinner } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { fetchAdminNotificationById } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";

import { NotificationDetailHeader } from "@/components/admin/notification-detail/NotificationDetailHeader";
import { NotificationDetailStats } from "@/components/admin/notification-detail/NotificationDetailStats";
import { NotificationMessageCard } from "@/components/admin/notification-detail/NotificationMessageCard";
import { NotificationDetailSidebar } from "@/components/admin/notification-detail/NotificationDetailSidebar";

function AdminNotificationDetailContent() {
  const params = useParams();
  const notifId = params.id as string;

  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminNotificationById(notifId);
        setNotification(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err) || "Failed to load notification");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [notifId]);

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white border border-[#EBE5F0] rounded-2xl shadow-xs">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-[#6E6678] animate-pulse">
            Loading notification details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !notification) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Alert variant="error">{error || "Notification not found."}</Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <NotificationDetailHeader notification={notification} />

      {/* 4 Metric Cards */}
      <NotificationDetailStats notification={notification} />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Message Content */}
        <div className="lg:col-span-8">
          <NotificationMessageCard notification={notification} />
        </div>

        {/* Right Column (4 cols): Recipient & Telemetry */}
        <div className="lg:col-span-4">
          <NotificationDetailSidebar notification={notification} />
        </div>
      </div>
    </main>
  );
}

export default function AdminNotificationDetailPage() {
  usePageTitle("Notification Detail | Admin");
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminNotificationDetailContent />
    </AuthGuard>
  );
}
