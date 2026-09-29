"use client";

import React from "react";
import { MessageSquareText } from "lucide-react";

interface NotificationMessageCardProps {
  notification: any;
}

export function NotificationMessageCard({
  notification,
}: NotificationMessageCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <MessageSquareText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Notification Message Body
            </h2>
            <p className="text-xs text-[#6E6678]">
              Delivered push and in-app communication content
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="p-5 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] text-sm text-[#3E3847] leading-relaxed whitespace-pre-line font-sans">
          {notification.message}
        </div>
      </div>
    </div>
  );
}
