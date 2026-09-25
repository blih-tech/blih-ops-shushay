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

import { Logo } from "./Logo";
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#D9CEDF]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Logo href={toRelativeUrl(talentUrl || "/")} priority className="h-5 w-auto" />
        </div>

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-0.5 rounded-md border border-[#D9CEDF] bg-white p-1 shadow-2xs">
          {loading ? (
            <div className="flex items-center gap-1 px-1">
              <Skeleton
                variant="rectangular"
                width={64}
                height={26}
                className="rounded-md bg-[#F4F1F8]"
              />
              <Skeleton
                variant="rectangular"
                width={72}
                height={26}
                className="rounded-md bg-[#F4F1F8]"
              />
              <Skeleton
                variant="rectangular"
                width={88}
                height={26}
                className="rounded-md bg-[#F4F1F8]"
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={26}
                className="rounded-md bg-[#F4F1F8]"
              />
            </div>
          ) : (
            navLinks.map((link) => (
              <Link
                key={link.label}
                href={toRelativeUrl(link.href)}
                className={`font-sans text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center whitespace-nowrap ${
                  link.active
                    ? "text-[#1E5BFF] font-semibold"
                    : "text-[#6E6678] hover:text-[#17131F]"
                }`}
              >
                {link.label}
              </Link>
            ))
          )}
        </div>

        {/* Account actions */}
        <div className="hidden sm:flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <Skeleton
                variant="circular"
                width={36}
                height={36}
                className="rounded-full bg-[#F4F1F8]"
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
            className="relative w-9 h-9 flex items-center justify-center text-[#17131F] hover:bg-[#F4F1F8] active:scale-95 rounded-md transition-all cursor-pointer border border-[#D9CEDF]"
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
