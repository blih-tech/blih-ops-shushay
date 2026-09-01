"use client";

import React, { useState } from "react";
import { Button, Input, PasswordInput, Alert } from "@blih/ui";
import { Mail, User as UserIcon } from "lucide-react";
import { Role } from "@blih/types";
import { API_URL } from "@/lib/urls";
import { GoogleIcon } from "./GoogleIcon";

interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    role: Role;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("TALENT");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, role });
  };

  const handleGoogleSignup = () => {
    const params = new URLSearchParams({ role });
    // Preserve returnTo from the current page's query string if present
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const returnTo = searchParams.get("returnTo");
      if (returnTo) params.set("returnTo", returnTo);
    }
    window.location.href = `${API_URL}/auth/google?${params.toString()}`;
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#D9CEDF] p-8 sm:p-10 rounded-3xl shadow-[0_16px_50px_rgba(30,91,255,0.06)] space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-bold text-[#17131F]">
          Create your free account
        </h2>
        <p className="font-sans text-sm text-[#6E6678]">
          Free includes learning discovery, profile building, opportunities,
          applications and certificates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Full name"
          type="text"
          value={fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFullName(e.target.value)
          }
          placeholder="Sara Tesfaye"
          leftIcon={<UserIcon className="h-4 w-4" />}
        />

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="sara@blih.example"
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <PasswordInput
          label="Password"
          required
          minLength={6}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="••••••••••"
        />

        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#6E6678]">
            I want to use BLIH OPS for
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("TALENT")}
              className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer text-center ${
                role === "TALENT"
                  ? "bg-[#EEF3FF] border-[#1E5BFF] text-[#1E5BFF]"
                  : "bg-white border-[#D9CEDF] text-[#6E6678] hover:bg-[#EEF3FF]/40"
              }`}
            >
              Learning + work
            </button>
            <button
              type="button"
              onClick={() => setRole("COMPANY")}
              className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer text-center ${
                role === "COMPANY"
                  ? "bg-[#EEF3FF] border-[#1E5BFF] text-[#1E5BFF]"
                  : "bg-white border-[#D9CEDF] text-[#6E6678] hover:bg-[#EEF3FF]/40"
              }`}
            >
              Hiring talent
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#D9CEDF]/70 w-full" />
        <span className="bg-white px-3 font-sans text-xs text-[#6E6678] uppercase absolute">
          or
        </span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#D9CEDF] bg-white hover:bg-[#EEF3FF]/60 hover:border-[#1E5BFF]/30 transition-all text-sm font-sans font-semibold text-[#17131F] cursor-pointer shadow-sm active:scale-[0.99]"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <p className="font-sans text-xs text-[#6E6678] text-center leading-relaxed">
        By creating an account, you agree to BLIH OPS terms. You can upgrade to
        Talent Pro later; Free remains useful.
      </p>
    </div>
  );
}
