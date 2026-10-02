"use client";

import React, { useState } from "react";
import { Button, Alert, Modal, Input } from "@blih/ui";
import { UserPlus, Copy, Check } from "lucide-react";
import { createAdminUser } from "@/lib/adminApi";
import { getErrorMessage } from "@blih/api-client";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAdminModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAdminModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setInviteLink(null);
    try {
      const newAdmin = await createAdminUser(email.trim());
      setSuccess(
        `Admin account created for ${newAdmin.email}. An invite email has been sent.`,
      );
      if (newAdmin.inviteLink) {
        setInviteLink(newAdmin.inviteLink);
      }
      setEmail("");
      onSuccess();
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Admin Account"
      description="Enter the email address of the new admin. They will receive an invite email with a link to set their own password."
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
            leftIcon={<UserPlus className="h-4 w-4" />}
            isLoading={loading}
            onClick={(e) => handleSubmit(e as any)}
          >
            Send Invite
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)}>
            <div className="space-y-2">
              <p>{success}</p>
              {inviteLink && (
                <div className="pt-2 border-t border-[#D9CEDF] flex items-center justify-between gap-2">
                  <span className="text-xs font-mono truncate text-[#4A4154] max-w-[220px]">
                    {inviteLink}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    leftIcon={
                      copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )
                    }
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              )}
            </div>
          </Alert>
        )}
        <Input
          id="create-admin-email"
          type="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          disabled={loading}
          fullWidth
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Modal>
  );
}
