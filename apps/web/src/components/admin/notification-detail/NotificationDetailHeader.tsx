"use client";

import React from "react";
import Link from "next/link";
import { Bell, Clock, User, CheckCircle2 } from "lucide-react";
import { Badge, Button } from "@blih/ui";

interface NotificationDetailHeaderProps {
  notification: any;
}

export function NotificationDetailHeader({
  notification,
}: NotificationDetailHeaderProps) {
  const recipientName =
    notification.user?.talentProfile?.fullName ||
    notification.user?.companyProfile?.companyName ||
    notification.user?.email ||
    "Recipient";

  const formatType = (t: string) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-white rounded-2xl border border-[#D9CEDF]/70 shadow-sm p-6 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFF7] border border-[#EBE5F0] shadow-xs flex items-center justify-center font-display font-bold text-2xl text-[#17131F] shrink-0">
            <Bell className="h-8 w-8 text-[#1E5BFF]" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#17131F]">
                {notification.title}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase bg-[#1E5BFF]/10 text-[#1E5BFF] border border-[#1E5BFF]/30">
                {formatType(notification.type)}
              </span>
              {notification.read ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Read
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  Unread
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6678]">
              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1 font-medium text-[#17131F]">
                <User className="h-3.5 w-3.5 text-[#6E6678]" />
                Sent to {recipientName}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-[#F9F8FC] border border-[#EBE5F0] rounded-lg px-2.5 py-1">
                <Clock className="h-3.5 w-3.5 text-[#6E6678]" />
                {new Date(notification.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {notification.user?.id && (
            <Link href={`/admin/users/${notification.user.id}`}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<User className="h-3.5 w-3.5" />}
              >
                Recipient Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
