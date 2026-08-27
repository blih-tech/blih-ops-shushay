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
import { Alert, Spinner, Button, Card, CardContent, Badge, GlobalNavbar } from "@/components/ui";
import { ProfileSetupSkeleton } from "@/components/profile/ProfileSkeleton";
import { StepPersonalInfo } from "@/components/profile/setup/StepPersonalInfo";
import { StepExpertise } from "@/components/profile/setup/StepExpertise";
import { StepMedia } from "@/components/profile/setup/StepMedia";
import { useProfileFormState } from "@/state/profile/profileForm";
import { LogOut, User, Sparkles, Image as ImageIcon, ChevronRight, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

function ProfileSetupContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, loading, error: fetchError, refetch } = useTalentProfile();

  const form = useProfileFormState(profile);
  const { trigger, getValues } = form;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <ProfileSetupSkeleton user={user} logout={logout} />;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert variant="error" title="Load Error">
            {fetchError}
          </Alert>
        </div>
      </div>
    );
  }

  const handleNextStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (step === 1) {
      const valid = await trigger(["fullName", "title", "phone", "country", "city"]);
      if (!valid) return;
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2) {
      const valid = await trigger(["englishLevel", "skills"]);
      if (!valid) return;
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 3) {
      setSaving(true);
      try {
        const values = getValues();
        await updateTalentProfile({
          fullName: values.fullName,
          title: values.title,
          phone: values.phone,
          country: values.country,
          city: values.city,
          englishLevel: values.englishLevel as any,
          skills: values.skills,
          bio: values.bio?.trim() || null,
        });

        await refetch();
        router.push("/profile");
      } catch (err: any) {
        setError(err?.message || "Failed to complete profile onboarding. Please try again.");
      } finally {
        setSaving(false);
      }
    }
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
    { id: 1, title: "Personal Details", icon: User, desc: "Name, title & contact" },
    { id: 2, title: "Skills & English", icon: Sparkles, desc: "Proficiency & stack" },
    { id: 3, title: "Media & Files", icon: ImageIcon, desc: "Photo & resume CV" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col font-sans antialiased relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />

      {/* Main wizard area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col">
        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">
          {/* Stepper rail */}
          <aside className="w-full lg:w-80 shrink-0 bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-6 shadow-sm">
            <div>
              <p className="text-xs font-mono font-bold text-[#6E6678] uppercase tracking-wider">
                Profile Setup Progress
              </p>
              <h2 className="font-display font-bold text-xl text-[#17131F] mt-1">
                Build your verified profile
              </h2>
            </div>

            <div className="space-y-4">
              {steps.map((s, index) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div key={s.id} className="relative">
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute left-5 top-12 bottom-[-16px] w-0.5 ${
                          isCompleted ? "bg-[#2E8F79]" : "bg-[#D9CEDF]"
                        }`}
                      />
                    )}

                    <div
                      className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                        isActive
                          ? "bg-[#EEF3FF] border border-[#1E5BFF]/30 text-[#1E5BFF]"
                          : isCompleted
                          ? "text-[#17131F]"
                          : "text-[#6E6678]"
                      }`}
                    >
                      <div
                        className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all shadow-xs ${
                          isActive
                            ? "bg-[#1E5BFF] text-white"
                            : isCompleted
                            ? "bg-[#2E8F79] text-white"
                            : "bg-white border border-[#D9CEDF] text-[#6E6678]"
                        }`}
                      >
                        {isCompleted ? <Check className="h-5 w-5" /> : s.id}
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p className="text-sm font-bold leading-tight font-display">
                          {s.title}
                        </p>
                        <p className="text-xs text-[#6E6678] mt-1 font-sans">
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
          <div className="flex-1 w-full min-w-0">
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-[0_8px_30px_rgba(23,19,31,0.04)] overflow-hidden bg-white">
              {/* Form header */}
              <div className="bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E5BFF] uppercase tracking-wider mb-2">
                  Step {step} of 3 <ChevronRight className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17131F]">
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Expertise & Technical Stack"}
                  {step === 3 && "Media & Curriculum Vitae"}
                </h3>
                <p className="text-sm text-[#6E6678] font-sans mt-1">
                  {step === 1 && "Provide your official contact details and current location."}
                  {step === 2 && "Select your English proficiency level and list your core capabilities."}
                  {step === 3 && "Upload your professional headshot and PDF curriculum vitae."}
                </p>
              </div>

              {/* Form body */}
              <CardContent className="p-6 sm:p-8 bg-white">
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
                    onNext={handleNextStep}
                    onBack={() => setStep(1)}
                  />
                )}

                {step === 3 && (
                  <StepMedia
                    photoUrl={profile?.photoUrl}
                    cvUrl={profile?.cvUrl}
                    onPhotoUpload={handlePhotoUpload}
                    onPhotoDelete={handlePhotoDelete}
                    onCvUpload={handleCvUpload}
                    onCvDelete={handleCvDelete}
                    onComplete={() => handleNextStep()}
                    onBack={() => setStep(2)}
                    saving={saving}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
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
