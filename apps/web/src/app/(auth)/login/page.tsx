import React, { Suspense } from "react";
import { Badge, Spinner } from "@blih/ui";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
        {/* Left Column: Value Panel (below form on mobile) */}
        <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#17131F] leading-[1.2]">
              Pick up where your skills <br className="hidden sm:inline" />
              and opportunities meet.
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
              Sign in to continue learning, update your evidence, apply to
              matched opportunities and manage Talent Pro.
            </p>
          </div>

          {/* Next Best Move Preview Card */}
          <div className="bg-white border border-[#D9CEDF] rounded-xl p-6 sm:p-8 shadow-xs space-y-3">
            <Badge variant="primary" size="sm">
              NEXT BEST MOVE
            </Badge>
            <h3 className="font-display text-xl font-bold text-[#17131F]">
              Complete Testing Evidence
            </h3>
            <p className="font-sans text-sm text-[#6E6678] leading-relaxed">
              Could strengthen your match for 3 opportunities this week.
            </p>
          </div>
        </div>

        {/* Right Column: Form Panel (first on mobile) */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <div className="w-full max-w-md bg-white border border-[#D9CEDF] p-8 sm:p-10 rounded-xl shadow-[0_16px_50px_rgba(30,91,255,0.06)] space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-3xl font-bold text-[#17131F]">
                Sign in
              </h2>
              <p className="font-sans text-sm text-[#6E6678]">
                Access your BLIH OPS learning, profile evidence and opportunity
                workspace.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="text-center py-8 text-sm text-[#6E6678] flex justify-center items-center gap-2">
                  <Spinner size="sm" /> Loading sign in...
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
