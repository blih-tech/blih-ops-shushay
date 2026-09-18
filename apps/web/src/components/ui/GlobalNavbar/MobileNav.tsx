"use client";

import React from "react";
import Link from "next/link";
import {
  LogOut,
  User as UserIcon,
  Settings,
  Shield,
  Briefcase,
  BookOpen,
  Building,
} from "lucide-react";
import { Button } from "../Button";
import { toRelativeUrl, type NavLinkItem } from "./GlobalNavbar.helpers";
import { Skeleton } from "../Skeleton";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navLinks: NavLinkItem[];
  user?: { email?: string; role?: string; photoUrl?: string } | null;
  loading?: boolean;
  role?: string;
  authUrl: string;
  skillsUrl: string;
  talentUrl: string;
  onSignOut?: () => void;
}

export function MobileNav({
  mobileMenuOpen,
  setMobileMenuOpen,
  navLinks,
  user,
  loading = false,
  role,
  authUrl,
  skillsUrl,
  talentUrl,
  onSignOut,
}: MobileNavProps) {
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-out origin-top transform ${
        mobileMenuOpen
          ? "max-h-[640px] opacity-100 translate-y-0 scale-100 mt-2 pointer-events-auto"
          : "max-h-0 opacity-0 -translate-y-3 scale-98 mt-0 pointer-events-none"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-3xl border border-white/60 ring-1 ring-[#D9CEDF]/50 rounded-2xl sm:rounded-3xl p-4 shadow-[0_30px_60px_-15px_rgba(30,91,255,0.15)] space-y-3 font-sans">
        {(loading && user || navLinks.length > 0) && (
          <div className="flex flex-col space-y-1">
            {loading && user ? (
              <div className="space-y-2 p-1">
                <Skeleton
                  variant="rectangular"
                  height={32}
                  className="w-full rounded-xl bg-[#EEF3FF]"
                />
                <Skeleton
                  variant="rectangular"
                  height={32}
                  className="w-full rounded-xl bg-[#EEF3FF]"
                />
                <Skeleton
                  variant="rectangular"
                  height={32}
                  className="w-full rounded-xl bg-[#EEF3FF]"
                />
              </div>
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={toRelativeUrl(link.href)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300 ease-out flex items-center ${
                    link.active
                      ? "bg-gradient-to-r from-[#EEF3FF] to-transparent text-[#1E5BFF] font-bold translate-x-1 border-l-2 border-[#1E5BFF]"
                      : "text-[#6E6678] hover:bg-white/60 hover:text-[#17131F] font-medium"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        )}

        <div className={`flex flex-col gap-2 ${navLinks.length > 0 || (loading && user) ? "pt-3 border-t border-[#D9CEDF]/70" : ""}`}>
          {user ? (
            <div className="space-y-2.5">
              <div className="p-3 bg-gradient-to-b from-[#EEF3FF]/60 to-transparent rounded-xl border border-[#D9CEDF]/30 flex items-center gap-3 shadow-[inset_0_1px_0_white]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E5BFF] to-[#0A3DCC] text-white flex items-center justify-center font-display font-bold text-sm shadow-inner ring-2 ring-white shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-[#6E6678]">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-[#17131F] truncate font-display">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role specific mobile shortcuts */}
              <div className="space-y-1 py-1">
                {role === "COMPANY" ? (
                  <>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/company/profile`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                    >
                      <Building className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Company Profile</span>
                    </Link>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/company/jobs`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                    >
                      <Briefcase className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Manage Jobs</span>
                    </Link>
                  </>
                ) : role === "ADMIN" ? (
                  <>
                    <Link
                      href={toRelativeUrl(`${skillsUrl}/admin`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                    >
                      <Shield className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Admin Portal</span>
                    </Link>
                    <Link
                      href={toRelativeUrl(`${skillsUrl}/admin/courses`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Course Studio</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/profile`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-[#1E5BFF]" />
                      <span>View Talent Profile</span>
                    </Link>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/profile/edit`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                    >
                      <Settings className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Edit Profile Details</span>
                    </Link>
                  </>
                )}
              </div>

              {onSignOut && (
                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  onClick={onSignOut}
                  leftIcon={<LogOut className="h-4 w-4 shrink-0" />}
                  className="flex flex-row items-center justify-center gap-2 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#FFF0F0] cursor-pointer"
                >
                  <span>Sign Out</span>
                </Button>
              )}
            </div>
          ) : (
            <>
              <Link href={toRelativeUrl(`${authUrl}/login`)} className="w-full">
                <Button variant="outline" fullWidth size="sm">
                  Sign in
                </Button>
              </Link>
              <Link
                href={toRelativeUrl(`${authUrl}/register`)}
                className="w-full"
              >
                <Button variant="primary" fullWidth size="sm">
                  Create account
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
