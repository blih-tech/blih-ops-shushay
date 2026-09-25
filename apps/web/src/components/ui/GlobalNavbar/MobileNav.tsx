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
      <div className="bg-white border border-[#D9CEDF] rounded-lg p-3 shadow-md space-y-2.5 font-sans">
        {(loading || navLinks.length > 0) && (
          <div className="flex flex-col space-y-1">
            {loading ? (
              <div className="space-y-2 p-1">
                <Skeleton
                  variant="rectangular"
                  height={32}
                  className="w-full rounded-md bg-[#F4F1F8]"
                />
                <Skeleton
                  variant="rectangular"
                  height={32}
                  className="w-full rounded-md bg-[#F4F1F8]"
                />
                <Skeleton
                  variant="rectangular"
                  height={32}
                  className="w-full rounded-md bg-[#F4F1F8]"
                />
              </div>
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={toRelativeUrl(link.href)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                    link.active
                      ? "bg-[#F4F1F8] text-[#17131F] font-semibold border-l-2 border-[#1E5BFF]"
                      : "text-[#6E6678] hover:bg-[#F9F8FC] hover:text-[#17131F] font-medium"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        )}

        <div className={`flex flex-col gap-2 ${navLinks.length > 0 || loading ? "pt-2.5 border-t border-[#D9CEDF]" : ""}`}>
          {loading ? (
            <div className="space-y-2 p-1">
              <Skeleton variant="rectangular" height={36} className="w-full rounded-md bg-[#F4F1F8]" />
            </div>
          ) : user ? (
            <div className="space-y-2">
              <div className="p-2.5 bg-[#F9F8FC] rounded-md border border-[#D9CEDF] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center font-sans font-bold text-xs shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono text-[#6E6678] uppercase">
                    Signed in as
                  </p>
                  <p className="text-xs font-semibold text-[#17131F] truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role specific mobile shortcuts */}
              <div className="space-y-0.5 py-0.5">
                {role === "COMPANY" ? (
                  <>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/company/profile`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                    >
                      <Building className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Company Profile</span>
                    </Link>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/company/jobs`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
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
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                    >
                      <Shield className="h-4 w-4 text-[#1E5BFF]" />
                      <span>Admin Portal</span>
                    </Link>
                    <Link
                      href={toRelativeUrl(`${skillsUrl}/admin/courses`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
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
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-[#1E5BFF]" />
                      <span>View Talent Profile</span>
                    </Link>
                    <Link
                      href={toRelativeUrl(`${talentUrl}/profile/edit`)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
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
                  className="flex flex-row items-center justify-center gap-2 text-[#EF4444] border-red-200 hover:bg-red-50 cursor-pointer"
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
