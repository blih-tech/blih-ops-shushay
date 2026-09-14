"use client";

import React from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 sm:py-16 px-4">
      <div className="w-full max-w-md">
        <div className="w-full text-center space-y-2 mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            {subtitle}
          </p>
        </div>

        <div className="w-full bg-white border border-[#D9CEDF] p-6 sm:p-10 rounded-3xl shadow-[0_12px_48px_rgba(30,91,255,0.06)]">
          {children}
        </div>
      </div>
    </div>
  );
}
