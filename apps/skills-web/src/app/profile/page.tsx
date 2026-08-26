"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";

function ProfileContent() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-border">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          My Profile
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-muted "
        >
          Sign Out
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6  space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Email Address
          </label>
          <p className="text-sm font-medium text-foreground mt-1">{user?.email}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Account Role
          </label>
          <p className="text-sm font-medium text-foreground mt-1">{user?.role}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Verification Status
          </label>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <ProfileContent />
    </AuthGuard>
  );
}
