"use client";

import React from "react";
import Link from "next/link";
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  Settings,
  Shield,
  Briefcase,
  BookOpen,
  Building,
} from "lucide-react";
import { Badge } from "../Badge";
import { toRelativeUrl } from "./GlobalNavbar.helpers";

interface UserMenuProps {
  user: { email?: string; role?: string; photoUrl?: string };
  role?: string;
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
  userMenuRef: React.RefObject<HTMLDivElement | null>;
  skillsUrl: string;
  talentUrl: string;
  onSignOut?: () => void;
}

export function UserMenu({
  user,
  role,
  userMenuOpen,
  setUserMenuOpen,
  userMenuRef,
  skillsUrl,
  talentUrl,
  onSignOut,
}: UserMenuProps) {
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative" ref={userMenuRef}>
      {/* Avatar trigger button */}
      <button
        type="button"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/60 backdrop-blur-md border border-[#D9CEDF]/50 shadow-[inset_0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(30,91,255,0.12)] hover:border-[#1E5BFF]/30 transition-all duration-300 ease-out cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/20"
        aria-expanded={userMenuOpen}
        aria-label="User account menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E5BFF] to-[#0A3DCC] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm overflow-hidden ring-2 ring-white group-hover:scale-105 transition-transform duration-300">
          {user.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{userInitial}</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#6E6678] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${userMenuOpen ? "rotate-180 text-[#1E5BFF]" : ""}`}
        />
      </button>

      {/* Floating Profile Popover Dropdown */}
      {userMenuOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-white/60 ring-1 ring-[#D9CEDF]/50 rounded-2xl shadow-[0_24px_50px_-12px_rgba(30,91,255,0.15)] z-50 overflow-hidden p-2 animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 ease-out font-sans">
          {/* User info header */}
          <div className="p-3 bg-gradient-to-b from-[#EEF3FF]/60 to-transparent rounded-xl mb-1 border border-[#D9CEDF]/30 shadow-[inset_0_1px_0_white]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E5BFF] to-[#0A3DCC] text-white flex items-center justify-center font-display font-bold text-sm shadow-inner shrink-0 ring-2 ring-white">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="text-sm font-bold text-[#17131F] truncate font-display">
                  {user.email}
                </p>
                {user.role && (
                  <div className="mt-1">
                    <Badge variant="primary" size="sm">
                      {user.role}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation actions */}
          <div className="space-y-1 py-1">
            {role === "COMPANY" ? (
              <>
                <Link
                  href={toRelativeUrl(`${talentUrl}/company/profile`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                >
                  <Building className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Company Profile</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${talentUrl}/company/jobs`)}
                  onClick={() => setUserMenuOpen(false)}
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
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                >
                  <Shield className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Admin Portal</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${skillsUrl}/admin/courses`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Course Studio</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={toRelativeUrl(`${talentUrl}/applications`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                >
                  <Briefcase className="h-4 w-4 text-[#1E5BFF]" />
                  <span>My Applications</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${talentUrl}/profile`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-[#1E5BFF]" />
                  <span>View Talent Profile</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${talentUrl}/profile/edit`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                >
                  <Settings className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Edit Profile Details</span>
                </Link>
              </>
            )}
          </div>

          {/* Sign out button */}
          {onSignOut && (
            <div className="pt-1 mt-1 border-t border-[#D9CEDF]/70">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FFF0F0] rounded-xl transition-colors font-medium cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
