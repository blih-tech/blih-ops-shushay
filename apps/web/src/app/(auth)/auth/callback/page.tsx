"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "@blih/ui";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const returnTo = searchParams.get("returnTo") || "/";

    if (token) {
      const isProd = window.location.protocol === "https:";
      const secureFlag = isProd ? "; Secure; SameSite=None" : "; SameSite=Lax";
      const maxAge = 7 * 24 * 60 * 60; // 7 days

      document.cookie = `token=${token}; path=/; max-age=${maxAge}${secureFlag}`;
      if (role) {
        document.cookie = `blih_role=${role}; path=/; max-age=${maxAge}${secureFlag}`;
      }

      refresh().then(() => {
        // Redirect to intended page or home
        try {
          const parsed = new URL(returnTo, window.location.origin);
          router.replace(parsed.pathname + parsed.search + parsed.hash);
        } catch {
          router.replace(returnTo.startsWith("/") ? returnTo : "/");
        }
      });
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, refresh]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Spinner size="lg" className="mx-auto text-[#1E5BFF]" />
        <p className="font-sans text-sm font-medium text-[#6E6678]">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-white">
          <Spinner size="lg" className="mx-auto text-[#1E5BFF]" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
