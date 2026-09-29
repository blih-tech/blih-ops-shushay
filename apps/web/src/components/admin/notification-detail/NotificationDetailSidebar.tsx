"use client";

import React from "react";
import Link from "next/link";
import { User, Mail, ArrowRight, Bell } from "lucide-react";
import { Button } from "@blih/ui";

interface NotificationDetailSidebarProps {
  notification: any;
}

export function NotificationDetailSidebar({
  notification,
}: NotificationDetailSidebarProps) {
  const user = notification.user;
  const recipientName =
    user?.talentProfile?.fullName ||
    user?.companyProfile?.companyName ||
    user?.email ||
    "Recipient User";

  return (
    <div className="space-y-6">
      {/* Recipient Account Details Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#1E5BFF]" />
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Recipient Account
            </h2>
          </div>
          {user?.role && (
            <span className="text-xs font-semibold text-[#6E6678] bg-[#F4EFF7] px-2 py-0.5 rounded-md uppercase">
              {user.role}
            </span>
          )}
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <div className="text-[11px] font-semibold uppercase text-[#9E95A8] mb-1">
              Account Holder
            </div>
            <div className="font-semibold text-sm text-[#17131F]">
              {recipientName}
            </div>
          </div>

          {user?.email && (
            <div className="pt-2 border-t border-[#F4EFF7] flex items-center gap-2 text-[#4A4453]">
              <Mail className="h-3.5 w-3.5 text-[#6E6678] shrink-0" />
              <span className="truncate font-mono">{user.email}</span>
            </div>
          )}

          {user?.id && (
            <div className="pt-3 border-t border-[#F4EFF7]">
              <Link href={`/admin/users/${user.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between text-xs"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Manage User Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Telemetry */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#2E8F79]" />
          <h2 className="font-display font-bold text-sm text-[#17131F]">
            Dispatch Telemetry
          </h2>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[#6E6678]">Read Status</span>
            <span className="font-semibold text-[#17131F]">
              {notification.read ? "Acknowledged" : "Unacknowledged"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#F4EFF7]">
            <span className="text-[#6E6678]">Dispatched On</span>
            <span className="font-mono text-[#17131F]">
              {new Date(notification.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
