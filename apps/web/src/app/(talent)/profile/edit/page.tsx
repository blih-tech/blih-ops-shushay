"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  Select,
  Alert,
} from "@blih/ui";
import { apiFetch } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { ProfileCompletionCard } from "@/components/profile/ProfileCompletionCard";
import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { CvUpload } from "@/components/profile/CvUpload";
import {
  uploadTalentPhoto,
  deleteTalentPhoto,
  uploadTalentCv,
  deleteTalentCv,
} from "@/lib/talentApi";
import type { TalentProfile } from "@/types/talent";

const ENGLISH_LEVEL_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
];

function ProfileContent() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");

  useEffect(() => {
    apiFetch<TalentProfile>("/talents/profile")
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName || "");
        setTitle(data.title || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setCountry(data.country || "");
        setCity(data.city || "");
        setEnglishLevel(data.englishLevel || "");
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await apiFetch<TalentProfile>("/talents/profile", {
        method: "PATCH",
        body: JSON.stringify({
          fullName,
          title,
          phone,
          bio,
          country,
          city,
          englishLevel,
        }),
      });

      setProfile(updated);
      await refresh();
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const updated = await uploadTalentPhoto(file);
    setProfile((prev) =>
      prev ? { ...prev, photoUrl: updated.photoUrl ?? null } : null,
    );
    await refresh();
  };

  const handlePhotoDelete = async () => {
    await deleteTalentPhoto();
    setProfile((prev) => (prev ? { ...prev, photoUrl: null } : null));
    await refresh();
  };

  const handleCvUpload = async (file: File) => {
    const updated = await uploadTalentCv(file);
    setProfile((prev) =>
      prev ? { ...prev, cvUrl: updated.cvUrl ?? null } : null,
    );
    await refresh();
  };

  const handleCvDelete = async () => {
    await deleteTalentCv();
    setProfile((prev) => (prev ? { ...prev, cvUrl: null } : null));
    await refresh();
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/dashboard">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
            <CardTitle className="text-2xl font-bold font-display">
              Talent Profile Settings
            </CardTitle>
            <CardDescription className="font-sans text-sm text-[#6E6678] mt-1">
              Update your basic details to build your remote credibility.
            </CardDescription>

            {error && (
              <Alert variant="error" className="mt-4">
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                variant="success"
                className="mt-4 bg-[#E6F5F0] border-[#2E8F79] text-[#2E8F79]"
              >
                {success}
              </Alert>
            )}

            {loading ? (
              <div className="space-y-6 py-6 animate-pulse">
                <div className="h-10 bg-[#EEF3FF] rounded-lg" />
                <div className="h-10 bg-[#EEF3FF] rounded-lg w-5/6" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                      Full Name
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                      Professional Title
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Full Stack Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                      Phone Number
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 911 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                      English Proficiency
                    </label>
                    <Select
                      value={englishLevel}
                      onChange={(e) => setEnglishLevel(e.target.value)}
                      options={ENGLISH_LEVEL_OPTIONS}
                      placeholder="Select Proficiency"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                      Country
                    </label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Ethiopia"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                      City
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Addis Ababa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">
                    Biography / Summary
                  </label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a brief professional summary..."
                    rows={4}
                  />
                </div>

                <div className="pt-4 border-t border-[#D9CEDF]/50 flex justify-end">
                  <Button type="submit" variant="primary" isLoading={saving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Profile Photo & Resume Upload Card on Left */}
          <Card className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
            <div>
              <CardTitle className="text-xl font-bold font-display">
                Profile Photo & Resume Document
              </CardTitle>
              <CardDescription className="font-sans text-sm text-[#6E6678] mt-1">
                Upload a professional headshot and your latest CV (PDF) to boost
                employer credibility.
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-stretch">
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
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <ProfileCompletionCard profile={profile} loading={loading} />
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfileContent />
    </AuthGuard>
  );
}
