"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTalentProfile } from "@/hooks/useTalentProfile";
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
} from "@/components/ui";
import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { CvUpload } from "@/components/profile/CvUpload";
import { GeneralDetailsForm } from "@/components/profile/GeneralDetailsForm";
import { ExperienceForm } from "@/components/profile/ExperienceForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { useProfileFormState } from "@/state/profile/profileForm";
import { Eye } from "lucide-react";

function ProfileEditContent() {
  const { profile, loading, error: fetchError, refetch } = useTalentProfile();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useProfileFormState(profile);
  const { handleSubmit } = form;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Spinner size="md" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading profile editor…
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4">
        <Alert variant="error" title="Load Error">
          {fetchError}
        </Alert>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-6">
      {/* Page header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-semibold text-xl text-foreground">
            Edit Talent Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your credentials, documents, and professional history.
          </p>
        </div>
        <Link href="/profile/preview">
          <Button variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
            Preview
          </Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Main form sections in single focused column */}
      <div className="space-y-6">
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
          <Card className="border border-border shadow-none">
            <CardHeader className="px-6 py-5 border-b border-border bg-muted/40">
              <CardTitle className="text-base font-semibold text-foreground font-sans">
                Media & Files
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Upload your professional headshot and CV document.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
