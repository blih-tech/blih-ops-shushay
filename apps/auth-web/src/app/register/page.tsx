"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input, PasswordInput, Alert } from "@/components/ui";
import { GraduationCap, Building2, ArrowRight, ArrowLeft, Mail, Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";

import { Role } from "@/types/user";

export default function RegisterPage() {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("TALENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSelectRole = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // 1. Navigation Header — full-width, content capped wide
  const navHeader = (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="flex justify-between items-center w-full px-6 md:px-10 xl:px-16 h-16 xl:h-20">
        <Link
          className="font-serif text-lg xl:text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
          href="/"
        >
          Blih Ecosystem
        </Link>
        <Link
          className="font-sans text-xs xl:text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-interactive ease-out px-4 py-2 border border-transparent hover:border-border rounded-md cursor-pointer"
          href="/login"
        >
          SIGN IN
        </Link>
      </div>
    </header>
  );

  // 2. Footer Section — full-width, content capped wide
  const footerSection = (
    <footer className="w-full px-6 md:px-10 xl:px-16 py-6 xl:py-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-muted-foreground text-xs xl:text-sm mt-auto font-sans">
      <p>© 2026 Blih Ecosystem. All rights reserved.</p>
      <div className="flex gap-4 mt-4 md:mt-0 font-sans text-xs xl:text-sm uppercase tracking-wider">
        <a className="hover:text-primary transition-colors duration-interactive ease-out" href="#">Privacy Policy</a>
        <span className="text-border">|</span>
        <a className="hover:text-primary transition-colors duration-interactive ease-out" href="#">Terms of Service</a>
        <span className="text-border">|</span>
        <a className="hover:text-primary transition-colors duration-interactive ease-out" href="#">Support</a>
      </div>
    </footer>
  );

  // Successful state
  if (success) {
    return (
      <div className="min-h-screen bg-muted text-foreground flex flex-col antialiased">
        {navHeader}
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 mt-20 mb-12">
          <div className="w-full max-w-md xl:max-w-lg bg-card border border-border p-8 xl:p-12 rounded-xl text-center space-y-6">
            <Alert variant="success" title="Check your email">
              {"We've sent you a link to verify your account. For local development, check the **blih-api** server console logs to retrieve the mock verification link."}
            </Alert>
            <div className="pt-4">
              <Link href="/login">
                <Button fullWidth>Go to Sign In</Button>
              </Link>
            </div>
          </div>
        </main>
        {footerSection}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted text-foreground flex flex-col antialiased">
      {navHeader}

      {/* Main — full width, generous top/bottom padding at all breakpoints */}
      <main className="flex-1 w-full px-6 md:px-10 xl:px-16 mt-24 xl:mt-32 mb-16 xl:mb-24 flex flex-col items-center justify-center">

        {step === "choose" ? (
          <div className="w-full flex flex-col items-center">

            {/* Hero headline — fluid from mobile → 1920px */}
            <div className="max-w-3xl xl:max-w-5xl text-center mb-12 xl:mb-16 space-y-5">
              <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-semibold tracking-tight text-foreground leading-tight">
                Your future starts here.
              </h1>
              <p className="font-sans text-sm md:text-base xl:text-lg text-muted-foreground leading-relaxed max-w-2xl xl:max-w-3xl mx-auto">
                Join the Blih Ecosystem. Whether you are looking to accelerate your skills or seeking top-tier operational talent, our structured platform provides the clarity you need.
              </p>
            </div>

            {/* Role Selection Cards — wider at xl, two columns always from md up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 w-full max-w-3xl xl:max-w-5xl">

              {/* Talent Card */}
              <button
                onClick={() => handleSelectRole("TALENT")}
                className="group relative bg-card border border-border p-8 xl:p-10 hover:border-primary/50 transition-all duration-interactive ease-out text-left flex flex-col justify-between overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl cursor-pointer"
              >
                <div className="absolute top-4 right-4 text-border group-hover:text-primary/30 transition-colors">
                  <Plus className="h-5 w-5 xl:h-6 xl:w-6" />
                </div>
                <div className="mb-10 xl:mb-14">
                  <div className="w-12 h-12 xl:w-14 xl:h-14 bg-muted flex items-center justify-center border border-border mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors group-hover:border-primary text-primary rounded-lg">
                    <GraduationCap className="h-6 w-6 xl:h-7 xl:w-7" />
                  </div>
                  <h2 className="font-serif text-xl xl:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    I want to learn
                  </h2>
                  <p className="text-sm xl:text-base text-muted-foreground leading-relaxed font-sans">
                    Access structured learning paths, track your skill gaps, and connect with mentors to advance your career.
                  </p>
                </div>
                <div className="flex items-center text-primary font-sans text-xs xl:text-sm uppercase tracking-wider mt-auto pt-6 border-t border-border w-full">
                  <span className="mr-2 font-medium">Join as Talent</span>
                  <ArrowRight className="h-4 w-4 xl:h-5 xl:w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Company Card */}
              <button
                onClick={() => handleSelectRole("COMPANY")}
                className="group relative bg-card border border-border p-8 xl:p-10 hover:border-primary/50 transition-all duration-interactive ease-out text-left flex flex-col justify-between overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl cursor-pointer"
              >
                <div className="absolute top-4 right-4 text-border group-hover:text-primary/30 transition-colors">
                  <Plus className="h-5 w-5 xl:h-6 xl:w-6" />
                </div>
                <div className="mb-10 xl:mb-14">
                  <div className="w-12 h-12 xl:w-14 xl:h-14 bg-muted flex items-center justify-center border border-border mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors group-hover:border-primary text-primary rounded-lg">
                    <Building2 className="h-6 w-6 xl:h-7 xl:w-7" />
                  </div>
                  <h2 className="font-serif text-xl xl:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    I want to hire
                  </h2>
                  <p className="text-sm xl:text-base text-muted-foreground leading-relaxed font-sans">
                    Source verified professionals, manage skills assessments, and build operational excellence within your team.
                  </p>
                </div>
                <div className="flex items-center text-primary font-sans text-xs xl:text-sm uppercase tracking-wider mt-auto pt-6 border-t border-border w-full">
                  <span className="mr-2 font-medium">Join as Company</span>
                  <ArrowRight className="h-4 w-4 xl:h-5 xl:w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="mt-16 xl:mt-20 w-full max-w-3xl xl:max-w-5xl border-t border-border pt-8 xl:pt-10 text-center font-sans">
              <p className="text-xs xl:text-sm uppercase tracking-widest text-muted-foreground mb-6 xl:mb-8">
                Trusted by industry leaders in operations
              </p>
              <div className="flex flex-wrap justify-center gap-8 xl:gap-16 items-center opacity-40 grayscale">
                <div className="flex items-center gap-1 text-foreground font-serif font-bold tracking-tight text-base xl:text-lg">
                  ▲ VORTEX
                </div>
                <div className="flex items-center gap-1 text-foreground font-mono font-bold tracking-tight text-sm xl:text-base">
                  <div className="w-3.5 h-3.5 xl:w-4 xl:h-4 border-2 border-foreground rounded-full"></div> ALTITUDE
                </div>
                <div className="flex items-center gap-1 text-foreground font-serif font-bold tracking-tight text-base xl:text-lg">
                  ▬ OMEGA
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Registration Form — centered, wider at xl */
          <div className="w-full max-w-md xl:max-w-lg mx-auto bg-card border border-border p-8 xl:p-12 rounded-xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl xl:text-3xl font-semibold tracking-tight text-foreground">
                Register as {role === "TALENT" ? "Talent" : "Company"}
              </h2>
              <p className="text-sm xl:text-base text-muted-foreground font-sans">
                Enter your credentials below to create your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-5">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <PasswordInput
                label="Password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>

              <div className="flex justify-between items-center pt-2 font-sans">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("choose")}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Change Role
                </Button>
                <Link
                  href="/login"
                  className="text-xs xl:text-sm font-medium text-primary hover:underline cursor-pointer"
                >
                  Sign In Instead
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>

      {footerSection}
    </div>
  );
}
