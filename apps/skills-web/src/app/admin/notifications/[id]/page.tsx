"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Clock,
} from "lucide-react";
import { Alert, Badge, Button } from "@blih/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { fetchAdminNotificationById } from "@/lib/adminApi";

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
      } catch (err: any) {
        setError(err.message || "Failed to load notification");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [notifId]);

  if (loading) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AdminBreadcrumb
          items={[{ label: "Notifications", href: "/admin/notifications" }, { label: "Loading..." }]}
        />
        <div className="h-64 bg-[#F9F8FC] rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (error || !notification) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <AdminBreadcrumb
          items={[{ label: "Notifications", href: "/admin/notifications" }, { label: "Error" }]}
        />
        <Alert variant="error">{error || "Notification not found"}</Alert>
      </main>
    );
  }

  const recipientName =
    notification.user?.talentProfile?.fullName ||
    notification.user?.companyProfile?.companyName ||
    notification.user?.email;

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Notifications", href: "/admin/notifications" },
          { label: notification.title },
        ]}
      />

      {/* Main Single Seamless Container */}
      <div className="bg-white rounded-3xl border border-[#D9CEDF] shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBE5F0] bg-gradient-to-r from-[#F9F8FC] to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0">
                <Bell className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                    {notification.title}
                  </h1>
                  <Badge variant="primary">
                    {notification.type.replace(/_/g, " ")}
                  </Badge>
                  {notification.read ? (
                    <Badge variant="secondary">READ</Badge>
                  ) : (
                    <Badge variant="warning">UNREAD</Badge>
                  )}
                </div>
                <p className="text-sm text-[#6E6678] flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Sent on {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 divide-y divide-[#EBE5F0]">
          {/* Notification Message */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-base text-[#17131F]">Message Body</h2>
            <div className="bg-[#F9F8FC] rounded-2xl p-5 border border-[#EBE5F0]">
              <p className="text-sm text-[#17131F] leading-relaxed whitespace-pre-line">
                {notification.message}
              </p>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="pt-8 space-y-4">
            <h2 className="font-display font-bold text-base text-[#17131F]">Recipient Account</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Recipient Name</p>
                <p className="font-medium text-[#17131F] mt-1">{recipientName}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Recipient Email</p>
                <p className="font-medium text-[#17131F] mt-1">{notification.user?.email}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6E6678] uppercase">Role</p>
                <p className="font-medium text-[#17131F] mt-1">{notification.user?.role}</p>
              </div>
            </div>

            {notification.user?.id && (
              <div className="pt-2">
                <Link href={`/admin/users/${notification.user.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Recipient User Account →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminNotificationDetailPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminNotificationDetailContent />
    </AuthGuard>
  );
}
