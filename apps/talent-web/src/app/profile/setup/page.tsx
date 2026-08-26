"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import {
  updateTalentProfile,
  uploadTalentPhoto,
  deleteTalentPhoto,
  uploadTalentCv,
  deleteTalentCv,
} from "@/lib/talentApi";
import { Alert, Spinner, Button, Card, CardContent } from "@/components/ui";
import { StepPersonalInfo } from "@/components/profile/setup/StepPersonalInfo";
import { StepExpertise } from "@/components/profile/setup/StepExpertise";
import { StepMedia } from "@/components/profile/setup/StepMedia";
import { useProfileFormState } from "@/state/profile/profileForm";
import { LogOut, User, Zap, Image as ImageIcon, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

function ProfileSetupContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const { profile, loading, error: fetchError, refetch } = useTalentProfile();

  const form = useProfileFormState(profile);
  const { trigger, getValues } = form;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center space-y-3">
          <Spinner size="md" />
          <p className="text-sm text-muted-foreground animate-pulse font-sans">
            Initializing setup wizard…
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6">
        <Alert variant="error" title="Load Error">
          {fetchError}
        </Alert>
      </div>
    );
  }

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      const isValid = await trigger(["fullName", "title", "phone", "country", "city"]);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await trigger(["englishLevel", "skills", "bio"]);
      if (isValid) {
        setSaving(true);
        try {
          const data = getValues();
          await updateTalentProfile({
            fullName: data.fullName,
            title: data.title,
            phone: data.phone,
            country: data.country,
            city: data.city,
            englishLevel: data.englishLevel as any,
            skills: data.skills,
            bio: data.bio?.trim() || null,
          });
          await refetch();
          setStep(3);
        } catch (err: any) {
          setError(err?.message || "Failed to save profile progress.");
        } finally {
          setSaving(false);
        }
      }
    }
  };

  const handleCompleteSetup = () => {
    router.push("/profile");
  };

  const handlePhotoUpload = async (file: File) => {
    await uploadTalentPhoto(file);
    await refetch();
  };

  const handlePhotoDelete = async () => {
    await deleteTalentPhoto();
    await refetch();
  };

  const handleCvUpload = async (file: File) => {
    await uploadTalentCv(file);
    await refetch();
  };

  const handleCvDelete = async () => {
    await deleteTalentCv();
    await refetch();
  };

  const steps = [
    { id: 1, title: "Personal Details", icon: User, desc: "Contact & location" },
    { id: 2, title: "Expertise", icon: Zap, desc: "Skills & languages" },
    { id: 3, title: "Media & Files", icon: ImageIcon, desc: "Photo & resume CV" },
  ];

  return (
    <div className="min-h-screen bg-muted flex flex-col font-sans">

      {/* Top bar */}
      <header className="bg-background border-b border-border h-14 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary-foreground fill-primary-foreground/20" />
          </div>
          <div>
            <span className="font-serif font-semibold text-foreground text-base leading-none block">
              Blih
            </span>
            <span className="font-mono text-[0.625rem] text-muted-foreground uppercase tracking-widest leading-none block mt-0.5">
              Talent Onboarding
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          rightIcon={<LogOut className="h-4 w-4" />}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Save & Exit
        </Button>
      </header>

      {/* Main wizard area */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col">
        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">

          {/* Stepper rail */}
          <aside className="w-full lg:w-72 shrink-0 bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Setup Progress
            </p>

            <div className="space-y-3">
              {steps.map((s, index) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                const Icon = s.icon;

                return (
                  <div key={s.id} className="relative">
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-10 bottom-[-14px] w-0.5 ${isCompleted ? "bg-primary" : "bg-border"
                          }`}
                      />
                    )}

                    <div
                      className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${isActive
                          ? "bg-primary/8 text-primary"
                          : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                    >
                      <div
                        className={`shrink-0 h-8 w-8 rounded-md flex items-center justify-center border text-xs font-mono font-semibold transition-colors ${isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : isCompleted
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : s.id}
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p
                          className={`text-sm font-medium leading-tight ${isActive ? "text-primary font-semibold" : "text-foreground"
                            }`}
                        >
                          {s.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Form card */}
          <main className="flex-1 w-full min-w-0">
            <Card className="border border-border shadow-none rounded-xl overflow-hidden bg-card">

              {/* Form header */}
              <div className="bg-muted/40 border-b border-border p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-1.5">
                  Step {step} of 3 <ChevronRight className="h-3 w-3" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-foreground">
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Expertise & Skills"}
                  {step === 3 && "Media & Curriculum Vitae"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {step === 1 && "Provide your official contact details and current location."}
                  {step === 2 && "Select your English proficiency level and list your technical capabilities."}
                  {step === 3 && "Upload your professional headshot and PDF curriculum vitae."}
                </p>
              </div>

              {/* Form body */}
              <CardContent className="p-6 sm:p-8">
                {step === 1 && (
                  <StepPersonalInfo
                    form={form}
                    saving={saving}
                    onNext={handleNextStep}
                  />
                )}

                {step === 2 && (
                  <StepExpertise
                    form={form}
                    saving={saving}
                    onBack={() => setStep(1)}
                    onNext={handleNextStep}
                  />
                )}

                {step === 3 && (
                  <StepMedia
                    photoUrl={profile?.photoUrl}
                    onPhotoUpload={handlePhotoUpload}
                    onPhotoDelete={handlePhotoDelete}
                    cvUrl={profile?.cvUrl}
                    onCvUpload={handleCvUpload}
                    onCvDelete={handleCvDelete}
                    saving={saving}
                    onBack={() => setStep(2)}
                    onComplete={handleCompleteSetup}
                  />
                )}
              </CardContent>
            </Card>
          </main>

        </div>
      </div>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfileSetupContent />
    </AuthGuard>
  );
}
