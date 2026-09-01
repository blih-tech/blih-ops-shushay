"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";
import { getNavLinks } from "./GlobalNavbar.helpers";
import type { NavLinkItem } from "./GlobalNavbar.helpers";
import { UserMenu } from "./GlobalNavbar/UserMenu";
import { MobileNav } from "./GlobalNavbar/MobileNav";

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
  onSignOut?: () => void;
  authUrl?: string;
  skillsUrl?: string;
  talentUrl?: string;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentApp,
  pathname: customPathname,
  user,
  onSignOut,
  authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003",
  skillsUrl = process.env.NEXT_PUBLIC_SKILLS_URL || "http://localhost:3001",
  talentUrl = process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

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
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <nav className="bg-white/95 backdrop-blur-md border border-[#D9CEDF] rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(23,19,31,0.04)]">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <a
            href={talentUrl}
            className="flex items-baseline gap-2.5 group cursor-pointer"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF] group-hover:opacity-90 transition-opacity">
              BLIH OPS
            </span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-[#6E6678] uppercase tracking-wider">
              Skill & Talent
            </span>
          </a>
        </div>

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-sans text-sm transition-colors py-1 cursor-pointer ${
                link.active
                  ? "text-[#1E5BFF] font-bold border-b-2 border-[#1E5BFF]"
                  : "text-[#17131F] hover:text-[#1E5BFF] font-normal"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Account actions */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
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
          ) : (
            <div className="flex items-center gap-2">
              <a href={`${authUrl}/login`}>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </a>
              <a href={`${authUrl}/register`}>
                <Button variant="primary" size="sm">
                  Create account
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
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
        role={role}
        authUrl={authUrl}
        skillsUrl={skillsUrl}
        talentUrl={talentUrl}
        onSignOut={onSignOut}
      />
    </header>
  );
};
