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
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-white border border-[#D9CEDF] hover:bg-[#F4F1F8] hover:border-[#1E5BFF]/30 transition-all duration-150 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/30"
        aria-expanded={userMenuOpen}
        aria-label="User account menu"
      >
        <div className="w-7 h-7 rounded-lg bg-[#1E5BFF] text-white flex items-center justify-center font-sans font-semibold text-xs shadow-xs overflow-hidden shrink-0">
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
          className={`h-4 w-4 text-[#6E6678] transition-transform duration-200 ${userMenuOpen ? "rotate-180 text-[#1E5BFF]" : ""}`}
        />
      </button>

      {/* Floating Profile Popover Dropdown */}
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#D9CEDF] rounded-lg shadow-md z-50 overflow-hidden p-1.5 font-sans">
          {/* User info header */}
          <div className="p-2.5 bg-[#F9F8FC] rounded-md mb-1 border border-[#D9CEDF]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center font-sans font-bold text-xs shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-[#6E6678] uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-[#17131F] truncate">
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
          <div className="space-y-0.5 py-0.5">
            {role === "COMPANY" ? (
              <>
                <Link
                  href={toRelativeUrl(`${talentUrl}/company/profile`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                >
                  <Building className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Company Profile</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${talentUrl}/company/jobs`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
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
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                >
                  <Shield className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Admin Portal</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${skillsUrl}/admin/courses`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
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
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                >
                  <Briefcase className="h-4 w-4 text-[#1E5BFF]" />
                  <span>My Applications</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${talentUrl}/profile`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-[#1E5BFF]" />
                  <span>View Talent Profile</span>
                </Link>
                <Link
                  href={toRelativeUrl(`${talentUrl}/profile/edit`)}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#17131F] hover:bg-[#F4F1F8] rounded-md transition-colors"
                >
                  <Settings className="h-4 w-4 text-[#1E5BFF]" />
                  <span>Edit Profile Details</span>
                </Link>
              </>
            )}
          </div>

          {/* Sign out button */}
          {onSignOut && (
            <div className="pt-1 mt-1 border-t border-[#D9CEDF]">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#EF4444] hover:bg-red-50 rounded-md transition-colors font-medium cursor-pointer"
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
