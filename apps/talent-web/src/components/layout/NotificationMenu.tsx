"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertCircle } from "lucide-react";
import { getUserNotifications, markNotificationAsRead } from "@blih/api-client";

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className="relative p-2 rounded-full bg-white/60 backdrop-blur-md border border-[#D9CEDF]/50 hover:bg-[#EEF3FF] transition-all text-[#17131F] focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 text-[#1E5BFF]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-[#D9CEDF] rounded-2xl shadow-xl z-50 p-3 space-y-2 text-xs font-sans animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF3]">
            <h4 className="font-display font-bold text-sm text-[#17131F] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1E5BFF]" /> Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#EEF3FF] text-[#1E5BFF] font-mono text-[10px] font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-center py-6 text-[#6E6678] font-mono">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <p className="text-center py-6 text-[#6E6678]">
              No notifications yet.
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-colors flex items-start gap-2.5 ${
                    n.read
                      ? "bg-white border-[#E6EAF3] text-[#6E6678]"
                      : "bg-[#EEF3FF]/70 border-[#1E5BFF]/30 text-[#17131F]"
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {n.type?.includes("SUCCESS") ? (
                      <Check className="w-4 h-4 text-[#2E8F79]" />
                    ) : n.type?.includes("APPLICATION") ? (
                      <Info className="w-4 h-4 text-[#1E5BFF]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#FF8A5B]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold text-xs leading-tight">
                      {n.title}
                    </p>
                    <p className="text-[11px] leading-relaxed text-[#4A4154]">
                      {n.message}
                    </p>
                    <span className="text-[10px] font-mono text-[#6E6678] block">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      title="Mark as read"
                      className="p-1 text-[#1E5BFF] hover:bg-white rounded-lg transition-colors shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
