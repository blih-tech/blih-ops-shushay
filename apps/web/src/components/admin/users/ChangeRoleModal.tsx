"use client";

import React, { useState } from "react";
import { Button, Modal, Alert } from "@blih/ui";
import { Shield } from "lucide-react";
import { updateAdminUserRole } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";
import type { AdminUser } from "@/types/admin";

interface PromoteToAdminModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function PromoteToAdminModal({
  user,
  onClose,
  onSuccess,
}: PromoteToAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  async function handlePromote() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await updateAdminUserRole(user.id, "ADMIN");
      onSuccess(`User ${user.email} has been promoted to Admin successfully.`);
      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to promote user to admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      title="Promote User to Admin"
      description={`Are you sure you want to promote ${user.email} to Administrator? They will receive full admin privileges.`}
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            leftIcon={<Shield className="h-4 w-4" />}
            isLoading={loading}
            onClick={handlePromote}
          >
            Promote to Admin
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <p className="text-sm text-[#4A4154]">
          Promoting <strong className="text-[#17131F]">{user.email}</strong> will grant them complete access to managing users, jobs, payments, and system configurations.
        </p>
      </div>
    </Modal>
  );
}
