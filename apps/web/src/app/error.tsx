"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@blih/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console or error-reporting service
    console.error("[GlobalError] Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-center items-center bg-[#F9F8FC] px-4 py-16 antialiased">
      <Card className="max-w-md w-full text-center border border-[#D9CEDF] shadow-xl bg-white rounded-xl">
        <CardHeader className="p-8 pb-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FFF0F0] text-[#EF4444] border border-[#EF4444]/20 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold font-display text-[#17131F]">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-sm mt-2 text-[#6E6678] font-sans">
            An unexpected error occurred while loading this page. Our team has been notified.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-2 space-y-4">
          {error.digest && (
            <p className="text-xs font-mono text-[#9B90A6] bg-[#F5F3F7] p-2 rounded border border-[#E9E4ED] truncate">
              Reference code: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => reset()}
              variant="primary"
              fullWidth
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Home className="h-4 w-4" />}
              >
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
