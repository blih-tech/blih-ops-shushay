"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";
import {
  getNavLinks,
  toRelativeUrl,
} from "./GlobalNavbar/GlobalNavbar.helpers";
import type { NavLinkItem } from "./GlobalNavbar/GlobalNavbar.helpers";
import { UserMenu } from "./GlobalNavbar/UserMenu";
import { MobileNav } from "./GlobalNavbar/MobileNav";

import { Skeleton } from "./Skeleton";

export type { NavLinkItem };

export interface GlobalNavbarProps {
  currentApp?:
    | "auth"
    | "skills"
    | "talent"
    | "talents"
    | "explore"
    | "courses"
    | "opportunities"
    | "jobs"
    | "business"
    | "dashboard"
    | "subscription"
    | "admin"
    | "company";
  pathname?: string;
  user?: { email?: string; role?: string; photoUrl?: string } | null;
  loading?: boolean;
  onSignOut?: () => void;
  authUrl?: string;
  skillsUrl?: string;
  talentUrl?: string;
  extraActions?: React.ReactNode;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentApp,
  pathname: customPathname,
  user,
  loading = false,
  onSignOut,
  authUrl = process.env.NEXT_PUBLIC_APP_URL || "",
  skillsUrl = process.env.NEXT_PUBLIC_APP_URL || "",
  talentUrl = process.env.NEXT_PUBLIC_APP_URL || "",
  extraActions,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, [user]);

  const currentPath = customPathname || activePath;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user?.role?.toUpperCase();

  const navLinks = getNavLinks({
    role,
    currentPath,
    currentApp,
    skillsUrl,
    talentUrl,
  });

  return (
    <header className="sticky top-3 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <nav className="bg-white/95 backdrop-blur-xl border border-[#D9CEDF]/80 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-[0_10px_30px_-14px_rgba(23,19,31,0.22)] transition-shadow duration-300">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link
            href={toRelativeUrl(talentUrl || "/")}
            className="flex items-baseline gap-2.5 group cursor-pointer"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF] group-hover:text-[#1546CC] transition-colors duration-200 whitespace-nowrap shrink-0">
              BLIH OPS
            </span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-[#6E6678] uppercase tracking-wider group-hover:text-[#1E5BFF] transition-colors duration-300">
              Skill & Talent
            </span>
          </Link>
        </div>

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {loading && user ? (
            <div className="flex items-center gap-2">
              <Skeleton
                variant="rectangular"
                width={64}
                height={28}
                className="rounded-xl bg-[#EEF3FF]"
              />
              <Skeleton
                variant="rectangular"
                width={72}
                height={28}
                className="rounded-xl bg-[#EEF3FF]"
              />
              <Skeleton
                variant="rectangular"
                width={88}
                height={28}
                className="rounded-xl bg-[#EEF3FF]"
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={28}
                className="rounded-xl bg-[#EEF3FF]"
              />
            </div>
          ) : (
            navLinks.map((link) => (
              <Link
                key={link.label}
                href={toRelativeUrl(link.href)}
                className={`relative font-sans text-sm px-4 py-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer flex items-center justify-center ${
                  link.active
                    ? "text-[#1E5BFF] font-bold bg-white shadow-sm ring-1 ring-[#D9CEDF]/50"
                    : "text-[#6E6678] hover:text-[#17131F] hover:bg-white/60 font-medium"
                }`}
              >
                {link.label}
              </Link>
            ))
          )}
        </div>

        {/* Account actions */}
        <div className="hidden sm:flex items-center gap-3">
          {loading && user ? (
            <div className="flex items-center gap-2">
              <Skeleton
                variant="circular"
                width={36}
                height={36}
                className="rounded-full bg-[#EEF3FF]"
              />
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              {extraActions}
              <UserMenu
                user={user}
                role={role}
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                userMenuRef={userMenuRef}
                skillsUrl={skillsUrl}
                talentUrl={talentUrl}
                onSignOut={onSignOut}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={toRelativeUrl(authUrl ? `${authUrl}/login` : "/login")}
              >
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link
                href={toRelativeUrl(
                  authUrl ? `${authUrl}/register` : "/register",
                )}
              >
                <Button variant="primary" size="sm">
                  Create account
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {extraActions && (
            <div className="flex items-center">{extraActions}</div>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-10 h-10 flex items-center justify-center text-[#17131F] hover:bg-[#EEF3FF] active:scale-95 rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#D9CEDF]/60"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Toggle navigation menu</span>
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu
                className={`h-5 w-5 absolute transition-all duration-300 transform ${
                  mobileMenuOpen
                    ? "rotate-90 opacity-0 scale-75"
                    : "rotate-0 opacity-100 scale-100"
                }`}
              />
              <X
                className={`h-5 w-5 absolute transition-all duration-300 transform ${
                  mobileMenuOpen
                    ? "rotate-0 opacity-100 scale-100 text-[#1E5BFF]"
                    : "-rotate-90 opacity-0 scale-75"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile drawer component */}
      <MobileNav
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navLinks={navLinks}
        user={user}
        loading={loading}
        role={role}
        authUrl={authUrl}
        skillsUrl={skillsUrl}
        talentUrl={talentUrl}
        onSignOut={onSignOut}
      />
    </header>
  );
};
