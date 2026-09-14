"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowUpRight } from "lucide-react";
import { toRelativeUrl } from "./GlobalNavbar/GlobalNavbar.helpers";

export interface GlobalFooterProps {
  user?: { email?: string; role?: string } | null;
  authUrl?: string;
  skillsUrl?: string;
  talentUrl?: string;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  user,
  authUrl = process.env.NEXT_PUBLIC_APP_URL || "",
  skillsUrl = process.env.NEXT_PUBLIC_APP_URL || "",
  talentUrl = process.env.NEXT_PUBLIC_APP_URL || "",
}) => {
  const role = user?.role?.toUpperCase();

  const getRoleLinks = () => {
    if (role === "COMPANY") {
      return [
        { label: "Hiring Hub", href: `${talentUrl}/company` },
        { label: "Talent Search", href: `${talentUrl}/company/talents` },
        { label: "Job Posts", href: `${talentUrl}/company/jobs` },
        {
          label: "Company Subscription",
          href: `${talentUrl}/company/subscription`,
        },
        { label: "Company Profile", href: `${talentUrl}/company/profile` },
      ];
    }
    if (role === "TALENT") {
      return [
        { label: "Explore Platform", href: `${talentUrl}/` },
        { label: "Skills Courses", href: `${skillsUrl}/courses` },
        { label: "Verified Opportunities", href: `${talentUrl}/jobs` },
        { label: "Learning Dashboard", href: `${skillsUrl}/dashboard` },
        { label: "My Certificates", href: `${skillsUrl}/certificates` },
        { label: "Talent Profile", href: `${talentUrl}/profile` },
      ];
    }
    if (role === "ADMIN") {
      return [
        { label: "Admin Hub", href: `${skillsUrl}/admin` },
        { label: "Course Studio", href: `${skillsUrl}/admin/courses` },
        { label: "Talent Directory", href: `${skillsUrl}/admin/talents` },
        { label: "Company Directory", href: `${skillsUrl}/admin/companies` },
      ];
    }
    // Guest / Unauthenticated
    return [
      { label: "Explore Ecosystem", href: `${talentUrl}/` },
      { label: "Blih Skills Courses", href: `${skillsUrl}/courses` },
      { label: "Verified Opportunities", href: `${talentUrl}/jobs` },
      { label: "Business Hiring Pass", href: `${talentUrl}/company` },
      { label: "Sign In", href: `${authUrl}/login` },
    ];
  };

  const roleLinks = getRoleLinks();

  return (
    <footer className="w-full bg-white text-[#17131F] pt-16 pb-10 mt-20 border-t border-[#D9CEDF]/70 relative z-10 selection:bg-[#DDE7FF] selection:text-[#1E5BFF] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#D9CEDF]/50">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5BFF]">
                BLIH OPS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#EEF3FF] text-[#1E5BFF] border border-[#C5D7FF] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#1E5BFF]" />
                Skill & Talent
              </span>
            </div>

            <p className="text-sm text-[#6E6678] font-sans leading-relaxed max-w-sm">
              Skill evidence connected to real opportunities. Empowering African
              engineering graduates and top employers with verified proof of
              work.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-[#2E8F79] bg-[#E6F6ED] border border-[#BDE8D0] px-3.5 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-[#2E8F79] animate-pulse shrink-0" />
              <span>All Systems Operational · Chapa Gateway</span>
            </div>
          </div>

          {/* Role Navigation Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-bold">
              {role ? `${role} Navigation` : "Platform Navigation"}
            </h4>
            <ul className="space-y-2.5">
              {roleLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={toRelativeUrl(link.href)}
                    className="text-sm text-[#17131F] hover:text-[#1E5BFF] transition-colors flex items-center gap-1.5 group font-medium"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#6E6678] group-hover:text-[#1E5BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Evidence Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-bold">
              Verified Evidence
            </h4>
            <div className="space-y-2 text-xs text-[#6E6678] leading-relaxed">
              <div className="flex items-center gap-2 text-[#17131F] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#2E8F79] shrink-0" />
                <span>Verified Assessment Certs</span>
              </div>
              <p>
                Course deliverables and project code evidence verified by
                automated grading engines.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Copyright Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#6E6678]">
          <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href={toRelativeUrl(`${talentUrl}/company/subscription`)}
              className="hover:text-[#1E5BFF] transition-colors"
            >
              Subscription
            </Link>
            <span className="text-[#D9CEDF]">·</span>
            <Link
              href={toRelativeUrl(`${skillsUrl}/courses`)}
              className="hover:text-[#1E5BFF] transition-colors"
            >
              Courses
            </Link>
            <span className="text-[#D9CEDF]">·</span>
            <Link
              href={toRelativeUrl(`${talentUrl}/jobs`)}
              className="hover:text-[#1E5BFF] transition-colors"
            >
              Opportunities
            </Link>
            <span className="text-[#D9CEDF]">·</span>
            <span className="text-[#6E6678]">ETB Chapa Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
