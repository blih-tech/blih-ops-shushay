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
    <div className="min-h-screen bg-muted text-foreground flex flex-col antialiased">
      {/* 1. Navigation Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-10 xl:px-16 h-16 xl:h-20">
          <Link
            className="font-serif text-lg xl:text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
            href="/"
          >
            Blih Ecosystem
          </Link>
          <Link
            className="font-sans text-xs xl:text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-interactive ease-out px-4 py-2 border border-transparent hover:border-border rounded-md cursor-pointer"
            href={isRegisterPage ? "/login" : "/register"}
          >
            {isRegisterPage ? "SIGN IN" : "SIGN UP"}
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-10 xl:px-16 mt-20 xl:mt-28 mb-12 xl:mb-20">
        <div className="w-full max-w-md xl:max-w-lg">
          <div className="w-full text-center space-y-2 mb-6 xl:mb-8">
            <h2 className="font-serif text-2xl xl:text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm xl:text-base text-muted-foreground font-sans">
              {subtitle}
            </p>
          </div>

          <div className="w-full bg-card border border-border p-5 sm:p-8 xl:p-10 rounded-xl shadow-sm">
            {children}
          </div>
        </div>
      </main>

      {/* 3. Footer Section */}
      <footer className="w-full px-4 sm:px-6 md:px-10 xl:px-16 py-6 xl:py-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-muted-foreground text-xs xl:text-sm mt-auto font-sans">
        <p>© 2026 Blih Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 font-sans text-xs xl:text-sm uppercase tracking-wider">
          <a className="hover:text-primary transition-colors duration-interactive ease-out" href="#">Privacy Policy</a>
          <span className="text-border">|</span>
          <a className="hover:text-primary transition-colors duration-interactive ease-out" href="#">Terms of Service</a>
          <span className="text-border">|</span>
          <a className="hover:text-primary transition-colors duration-interactive ease-out" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
