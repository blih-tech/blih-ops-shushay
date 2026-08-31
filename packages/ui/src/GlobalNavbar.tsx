"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, Sparkles, ChevronDown, Settings, Shield, Briefcase, BookOpen, Layers, Building } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

export interface NavLinkItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface GlobalNavbarProps {
  currentApp?: "auth" | "skills" | "talent" | "talents" | "explore" | "courses" | "opportunities" | "jobs" | "business" | "dashboard" | "subscription" | "admin" | "company";
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

  // Helper to determine exact or prefix path match
  const isMatch = (targetPath: string, exact = false): boolean => {
    if (!currentPath) return false;
    if (exact || targetPath === "/") {
      return currentPath === targetPath;
    }
    return currentPath.startsWith(targetPath);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute role-based navigation links
  const role = user?.role?.toUpperCase();

  let navLinks: NavLinkItem[] = [];

  if (role === "TALENT") {
    navLinks = [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Courses",
        href: `${skillsUrl}/courses`,
        active: currentPath ? isMatch("/courses") && !isMatch("/admin") : currentApp === "courses",
      },
      {
        label: "Opportunities",
        href: `${talentUrl}/jobs`,
        active: currentPath ? isMatch("/jobs") : currentApp === "opportunities",
      },
      {
        label: "Dashboard",
        href: `${skillsUrl}/dashboard`,
        active: currentPath ? isMatch("/dashboard") : currentApp === "dashboard",
      },
    ];
  } else if (role === "COMPANY") {
    navLinks = [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Hiring Hub",
        href: `${talentUrl}/company`,
        active: currentPath ? isMatch("/company", true) : currentApp === "company" || currentApp === "business",
      },
      {
        label: "Talent Search",
        href: `${talentUrl}/company/talents`,
        active: currentPath ? isMatch("/company/talents") : currentApp === "talents",
      },
      {
        label: "Job Posts",
        href: `${talentUrl}/company/jobs`,
        active: currentPath ? isMatch("/company/jobs") : currentApp === "jobs",
      },
      {
        label: "Subscription",
        href: `${talentUrl}/company/subscription`,
        active: currentPath ? isMatch("/company/subscription") : currentApp === "subscription",
      },
    ];
  } else if (role === "ADMIN") {
    navLinks = [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Admin Hub",
        href: `${skillsUrl}/admin`,
        active: currentPath ? isMatch("/admin", true) : currentApp === "admin",
      },
      {
        label: "Course Studio",
        href: `${skillsUrl}/admin/courses`,
        active: isMatch("/admin/courses"),
      },
      {
        label: "Talent Directory",
        href: `${skillsUrl}/admin/talents`,
        active: isMatch("/admin/talents"),
      },
      {
        label: "Companies",
        href: `${skillsUrl}/admin/companies`,
        active: isMatch("/admin/companies"),
      },
    ];
  } else {
    // Unauthenticated guest navigation
    navLinks = [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Courses",
        href: `${skillsUrl}/courses`,
        active: currentPath ? isMatch("/courses") : currentApp === "courses" || currentApp === "skills",
      },
      {
        label: "Opportunities",
        href: `${talentUrl}/jobs`,
        active: currentPath ? isMatch("/jobs") : currentApp === "opportunities",
      },
      {
        label: "Business",
        href: `${talentUrl}/company`,
        active: currentPath ? isMatch("/company") : currentApp === "business",
      },
    ];
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <nav className="bg-white/95 backdrop-blur-md border border-[#D9CEDF] rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(23,19,31,0.04)]">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <a href={talentUrl} className="flex items-baseline gap-2.5 group cursor-pointer">
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
              className={`font-sans text-sm transition-colors py-1 cursor-pointer ${link.active
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
            <div className="relative" ref={userMenuRef}>
              {/* Avatar trigger button */}
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-[#EEF3FF] border border-[#D9CEDF] hover:border-[#1E5BFF]/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/20"
                aria-expanded={userMenuOpen}
                aria-label="User account menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm overflow-hidden">
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-[#6E6678] transition-transform duration-200 ${userMenuOpen ? "rotate-180 text-[#1E5BFF]" : ""}`} />
              </button>

              {/* Floating Profile Popover Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#D9CEDF] rounded-2xl shadow-[0_16px_40px_rgba(23,19,31,0.08)] z-50 overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-150 font-sans">
                  {/* User info header */}
                  <div className="p-3 bg-[#EEF3FF]/40 rounded-xl mb-1 border border-[#D9CEDF]/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm shrink-0">
                        {userInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-[#17131F] truncate font-display">{user.email}</p>
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
                        <a
                          href={`${talentUrl}/company/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                        >
                          <Building className="h-4 w-4 text-[#1E5BFF]" />
                          <span>Company Profile</span>
                        </a>
                        <a
                          href={`${talentUrl}/company/jobs`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                        >
                          <Briefcase className="h-4 w-4 text-[#1E5BFF]" />
                          <span>Manage Jobs</span>
                        </a>
                      </>
                    ) : role === "ADMIN" ? (
                      <>
                        <a
                          href={`${skillsUrl}/admin`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                        >
                          <Shield className="h-4 w-4 text-[#1E5BFF]" />
                          <span>Admin Portal</span>
                        </a>
                        <a
                          href={`${skillsUrl}/admin/courses`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                        >
                          <BookOpen className="h-4 w-4 text-[#1E5BFF]" />
                          <span>Course Studio</span>
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href={`${talentUrl}/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                        >
                          <User className="h-4 w-4 text-[#1E5BFF]" />
                          <span>View Talent Profile</span>
                        </a>
                        <a
                          href={`${talentUrl}/profile/edit`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                        >
                          <Settings className="h-4 w-4 text-[#1E5BFF]" />
                          <span>Edit Profile Details</span>
                        </a>
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
                  mobileMenuOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
                }`}
              />
              <X
                className={`h-5 w-5 absolute transition-all duration-300 transform ${
                  mobileMenuOpen ? "rotate-0 opacity-100 scale-100 text-[#1E5BFF]" : "-rotate-90 opacity-0 scale-75"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown with smooth height & fade transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out origin-top transform ${
          mobileMenuOpen
            ? "max-h-[640px] opacity-100 translate-y-0 scale-100 mt-2 pointer-events-auto"
            : "max-h-0 opacity-0 -translate-y-3 scale-98 mt-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border border-[#D9CEDF] rounded-2xl sm:rounded-3xl p-4 shadow-[0_20px_50px_rgba(23,19,31,0.1)] space-y-3 font-sans">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  link.active
                    ? "bg-[#EEF3FF] text-[#1E5BFF] font-semibold translate-x-1"
                    : "text-[#17131F] hover:bg-[#EEF3FF] hover:text-[#1E5BFF]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#D9CEDF]/70 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2.5">
                <div className="p-3 bg-[#EEF3FF]/40 rounded-xl border border-[#D9CEDF]/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-[#6E6678]">Signed in as</p>
                    <p className="text-sm font-bold text-[#17131F] truncate font-display">{user.email}</p>
                  </div>
                </div>

                {/* Role specific mobile shortcuts */}
                <div className="space-y-1 py-1">
                  {role === "COMPANY" ? (
                    <>
                      <a
                        href={`${talentUrl}/company/profile`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                      >
                        <Building className="h-4 w-4 text-[#1E5BFF]" />
                        <span>Company Profile</span>
                      </a>
                      <a
                        href={`${talentUrl}/company/jobs`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                      >
                        <Briefcase className="h-4 w-4 text-[#1E5BFF]" />
                        <span>Manage Jobs</span>
                      </a>
                    </>
                  ) : role === "ADMIN" ? (
                    <>
                      <a
                        href={`${skillsUrl}/admin`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                      >
                        <Shield className="h-4 w-4 text-[#1E5BFF]" />
                        <span>Admin Portal</span>
                      </a>
                      <a
                        href={`${skillsUrl}/admin/courses`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-[#1E5BFF]" />
                        <span>Course Studio</span>
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={`${talentUrl}/profile`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                      >
                        <User className="h-4 w-4 text-[#1E5BFF]" />
                        <span>View Talent Profile</span>
                      </a>
                      <a
                        href={`${talentUrl}/profile/edit`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#17131F] hover:bg-[#EEF3FF] rounded-xl transition-colors"
                      >
                        <Settings className="h-4 w-4 text-[#1E5BFF]" />
                        <span>Edit Profile Details</span>
                      </a>
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
                <a href={`${authUrl}/login`} className="w-full">
                  <Button variant="outline" fullWidth size="sm">
                    Sign in
                  </Button>
                </a>
                <a href={`${authUrl}/register`} className="w-full">
                  <Button variant="primary" fullWidth size="sm">
                    Create account
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
