"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isRegisterPage = pathname === "/register";

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient subtle glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-[#FFFFFF]/50 to-transparent pointer-events-none -z-10" />

      {/* 1. Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-white/90 backdrop-blur-md border border-[#D9CEDF] rounded-2xl sm:rounded-3xl px-6 py-3.5 flex justify-between items-center shadow-[0_8px_30px_rgba(23,19,31,0.04)]">
          <Link
            className="flex items-baseline gap-2 group"
            href={process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002"}
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF] group-hover:opacity-90 transition-opacity">
              Blih
            </span>
            <span className="hidden sm:inline-block font-mono text-xs text-[#6E6678] uppercase tracking-wider">
              Skill & Talent
            </span>
          </Link>
          <Link
            className="font-mono text-xs font-medium uppercase tracking-wider text-[#6E6678] hover:text-[#1E5BFF] transition-colors px-4 py-2 border border-[#D9CEDF] hover:border-[#1E5BFF]/30 rounded-xl cursor-pointer bg-white"
            href={isRegisterPage ? "/login" : "/register"}
          >
            {isRegisterPage ? "SIGN IN" : "SIGN UP"}
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-10 py-10 sm:py-16">
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
      </main>

      {/* 3. Footer Section */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono mt-auto gap-4">
        <p>© 2026 Blih Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          <a className="hover:text-[#1E5BFF] transition-colors" href="#">Privacy Policy</a>
          <span className="text-[#D9CEDF]">·</span>
          <a className="hover:text-[#1E5BFF] transition-colors" href="#">Terms of Service</a>
          <span className="text-[#D9CEDF]">·</span>
          <a className="hover:text-[#1E5BFF] transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
