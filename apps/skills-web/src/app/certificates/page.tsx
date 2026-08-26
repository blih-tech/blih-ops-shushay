"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CertificatesPage() {
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          Certificates
        </h1>
        <div className="p-12 text-center bg-muted border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-sans">
            {"You haven't earned any certificates yet. Complete courses to unlock them."}
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
