"use client";

import React from "react";
import { Button } from "@blih/ui";
import { Mail, UserCheck, UserX, Shield, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AdminUser } from "@/types/admin";

interface UserTableActionsProps {
  user: AdminUser;
  actionLoading: string | null;
  onResendInvite: (user: AdminUser) => void;
  onStatusClick: (user: AdminUser) => void;
  onPromoteClick: (user: AdminUser) => void;
  onDeleteClick: (user: AdminUser) => void;
}

export function UserTableActions({
  user,
  actionLoading,
  onResendInvite,
  onStatusClick,
  onPromoteClick,
  onDeleteClick,
}: UserTableActionsProps) {
  const isLoading = actionLoading === user.id;

  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      {(user.role === "ADMIN" || !user.emailVerified) && (
        <Button
          size="sm"
          variant="ghost"
          className="px-2 font-normal"
          title="Resend invite or set-password email"
          leftIcon={<Mail className="h-3.5 w-3.5" />}
          onClick={() => onResendInvite(user)}
          isLoading={isLoading}
        >
          Invite
        </Button>
      )}
      {user.role !== "ADMIN" && (
        <Button
          size="sm"
          variant="ghost"
          className="px-2 font-normal text-[#1E5BFF] hover:bg-[#EEF3FF]"
          title="Promote this user to Admin"
          leftIcon={<Shield className="h-3.5 w-3.5 text-[#1E5BFF]" />}
          onClick={() => onPromoteClick(user)}
          isLoading={isLoading}
        >
          Promote
        </Button>
      )}
      {user.isActive === false ? (
        <Button
          size="sm"
          variant="ghost"
          className="px-2 text-[#2E8F79] hover:bg-[#E8F5E9] font-normal"
          title="Activate account"
          leftIcon={<UserCheck className="h-3.5 w-3.5 text-[#2E8F79]" />}
          onClick={() => onStatusClick(user)}
          isLoading={isLoading}
        >
          Activate
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="px-2 text-[#D97706] hover:bg-[#FEF3C7] font-normal"
          title="Suspend user account"
          leftIcon={<UserX className="h-3.5 w-3.5 text-[#D97706]" />}
          onClick={() => onStatusClick(user)}
          isLoading={isLoading}
        >
          Suspend
        </Button>
      )}
      <Link href={`/admin/users/${user.id}`}>
        <Button
          size="sm"
          variant="ghost"
          className="px-2 font-normal"
          title="View Details"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
        >
          View
        </Button>
      </Link>
      <Button
        size="sm"
        variant="ghost"
        className="px-2 text-[#D32F2F] hover:bg-[#FFEBEE] hover:text-[#C62828] font-normal"
        title="Delete User"
        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
        onClick={() => onDeleteClick(user)}
        isLoading={isLoading}
      >
        Delete
      </Button>
    </div>
  );
}
