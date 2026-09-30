"use client";

import React from "react";
import { Shield, Briefcase, BookOpen, Building2, Award } from "lucide-react";
import type { AdminUserDetail } from "@/types/admin";

interface UserDetailStatsProps {
  user: AdminUserDetail;
  enrollmentsCount: number;
}

export function UserDetailStats({
  user,
  enrollmentsCount,
}: UserDetailStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Account Role
          </span>
          <div className="p-2 rounded-lg bg-[#1E5BFF]/10 text-[#1E5BFF]">
            <Shield className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {user.role}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            {user.emailVerified ? "Verified user" : "Pending verification"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            {user.role === "COMPANY" ? "Jobs Posted" : "Applications"}
          </span>
          <div className="p-2 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {user.role === "COMPANY"
              ? user.companyProfile?._count?.jobs ?? 0
              : user.talentProfile?._count?.jobApplications ?? 0}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            {user.role === "COMPANY" ? "Total listings" : "Submissions recorded"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            {user.role === "COMPANY" ? "Subscription" : "Enrolled Courses"}
          </span>
          <div className="p-2 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            {user.role === "COMPANY" ? (
              <Building2 className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {user.role === "COMPANY"
              ? user.companyProfile?.companySubscription?.status ||
                (user.companyProfile?.subscriptionActive ? "ACTIVE" : "INACTIVE")
              : enrollmentsCount}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            {user.role === "COMPANY"
              ? user.companyProfile?.companySubscription?.plan || "Free tier"
              : "Active course access"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#EBE5F0] p-4.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6E6678] uppercase tracking-wider">
            Certificates
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-display font-bold text-[#17131F]">
            {user._count?.certificates ?? 0}
          </div>
          <div className="text-xs text-[#6E6678] mt-0.5">
            {user._count?.paymentTransactions ?? 0} transactions
          </div>
        </div>
      </div>
    </div>
  );
}
