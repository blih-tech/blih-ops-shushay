"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { useAuth } from "@/providers/AuthProvider";
import {
  updateTalentProfile,
  uploadTalentPhoto,
  deleteTalentPhoto,
  uploadTalentCv,
  deleteTalentCv,
} from "@/lib/talentApi";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Alert,
  Spinner,
  GlobalNavbar,
  Skeleton,
} from "@/components/ui";
import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { CvUpload } from "@/components/profile/CvUpload";
import { GeneralDetailsForm } from "@/components/profile/GeneralDetailsForm";
import { SkillsInput } from "@/components/profile/SkillsInput";
import { ExperienceForm } from "@/components/profile/ExperienceForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { useProfileFormState } from "@/state/profile/profileForm";
import { Eye, ArrowLeft } from "lucide-react";

function ProfileEditContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error: fetchError, refetch } = useTalentProfile();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useProfileFormState(profile);
  const { handleSubmit } = form;

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative">
        <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton variant="rectangular" className="h-6 w-32 rounded-lg" />
            <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
                <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
                <Skeleton variant="rectangular" className="h-32 rounded-2xl" />
                <Skeleton variant="rectangular" className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
                <Skeleton variant="rectangular" className="h-8 w-32 rounded-xl" />
                <Skeleton variant="circular" className="h-24 w-24 mx-auto" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />
        <div className="max-w-md mx-auto mt-12 px-4">
          <Alert variant="error" title="Load Error">
            {fetchError}
          </Alert>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
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
      setSuccess("Profile details updated successfully.");
      await refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-white text-[#17131F]">
      <GlobalNavbar currentApp="talent" user={user} onSignOut={logout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9CEDF] pb-6">
          <div className="space-y-1">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Profile Decision Page
            </Link>
            <h1 className="font-display font-bold text-3xl text-[#17131F]">
              Edit Talent Profile
            </h1>
            <p className="text-sm text-[#6E6678]">
              Update your credentials, documents, skills, and verified history.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/profile/preview">
              <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                Live Preview
              </Button>
            </Link>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Main form sections */}
        <div className="space-y-8">
          <section id="section-general">
            <GeneralDetailsForm
              form={form}
              saving={saving}
              onSubmit={handleSubmit(onSubmit)}
            />
          </section>

          <section id="section-experience">
            <ExperienceForm
              entries={profile?.experience || []}
              onRefresh={refetch}
            />
          </section>

          <section id="section-education">
            <EducationForm
              entries={profile?.education || []}
              onRefresh={refetch}
            />
          </section>

          <section id="section-media">
            <Card className="rounded-3xl border border-[#D9CEDF] shadow-sm">
              <CardHeader className="px-6 py-5 border-b border-[#D9CEDF] bg-[#EEF3FF]/40 rounded-t-3xl">
                <CardTitle className="text-lg font-bold font-display text-[#17131F]">
                  Media & Documents
                </CardTitle>
                <CardDescription className="text-sm text-[#6E6678]">
                  Upload your professional headshot and CV document.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <PhotoUpload
                    value={profile?.photoUrl}
                    onUpload={handlePhotoUpload}
                    onDelete={handlePhotoDelete}
                  />
                  <CvUpload
                    value={profile?.cvUrl}
                    onUpload={handleCvUpload}
                    onDelete={handleCvDelete}
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ProfileEditPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfileEditContent />
    </AuthGuard>
  );
}
