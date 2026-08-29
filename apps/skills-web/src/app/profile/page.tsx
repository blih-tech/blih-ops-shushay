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
  CardContent,
  Input,
  Textarea,
  Select,
  Alert,
  GlobalNavbar,
} from "@blih/ui";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, User, ExternalLink, Award, Sparkles, CheckCircle2 } from "lucide-react";

interface TalentProfile {
  id: string;
  fullName: string | null;
  title: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  englishLevel: string | null;
  skills: string[];
  photoUrl: string | null;
  cvUrl: string | null;
  profileCompletion: {
    percentage: number;
    missingFields: string[];
    isComplete: boolean;
  };
}

const ENGLISH_LEVEL_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
];

function ProfileContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");

  const talentUrl = process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002";

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
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getFriendlyFieldName = (field: string) => {
    const names: Record<string, string> = {
      fullName: "Full Name",
      title: "Professional Title",
      phone: "Phone Number",
      country: "Country",
      city: "City",
      englishLevel: "English Level",
      skills: "Skills List",
      experience: "Work Experience",
      education: "Education Details",
      cvUrl: "CV Document Upload",
    };
    return names[field] || field;
  };

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      <GlobalNavbar
        currentApp="skills"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
              <CardTitle className="text-2xl font-bold font-display">Talent Profile Settings</CardTitle>
              <CardDescription className="font-sans text-sm text-[#6E6678] mt-1">
                Update your basic details to build your remote credibility.
              </CardDescription>

              {error && (
                <Alert variant="error" className="mt-4">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mt-4 bg-[#E6F5F0] border-[#2E8F79] text-[#2E8F79]">
                  {success}
                </Alert>
              )}

              {loading ? (
                <div className="space-y-6 py-6 animate-pulse">
                  <div className="h-10 bg-[#EEF3FF] rounded-lg" />
                  <div className="h-10 bg-[#EEF3FF] rounded-lg w-5/6" />
                  <div className="h-24 bg-[#EEF3FF] rounded-lg" />
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">Full Name</label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">Professional Title</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Full Stack Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">Phone Number</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 911 ..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">English Proficiency</label>
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
                      <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">Country</label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Ethiopia"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">City</label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Addis Ababa"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-[#6E6678] uppercase">Biography / Summary</label>
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
          </div>

          {/* Right Column: Completion Meter */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-[#D9CEDF] rounded-3xl p-6 bg-white shadow-xs space-y-6">
              <div>
                <CardTitle className="text-xl font-bold font-display flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1E5BFF]" />
                  <span>Profile Completion</span>
                </CardTitle>
                <CardDescription className="font-sans text-xs text-[#6E6678] mt-1">
                  Complete your verified profile to apply for opportunities.
                </CardDescription>
              </div>

              {!loading && profile && (
                <div className="space-y-6">
                  {/* Progress Ring / Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="font-mono text-xs font-bold text-[#6E6678] uppercase">Current Level</span>
                      <span className="font-display text-2xl font-bold text-[#1E5BFF]">
                        {profile.profileCompletion.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-[#EEF3FF] h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E5BFF] h-full rounded-full transition-all duration-500"
                        style={{ width: `${profile.profileCompletion.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Missing Fields Checklist */}
                  {profile.profileCompletion.missingFields.length > 0 ? (
                    <div className="space-y-3">
                      <span className="font-mono text-xs font-bold text-[#6E6678] uppercase block">
                        Remaining Items ({profile.profileCompletion.missingFields.length})
                      </span>
                      <div className="space-y-2">
                        {profile.profileCompletion.missingFields.map((field) => (
                          <div key={field} className="flex items-center gap-2 text-xs text-[#6E6678] font-sans">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6E6678]" />
                            <span>{getFriendlyFieldName(field)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-sans text-[#2E8F79] bg-[#E6F5F0] p-3 rounded-xl border border-[#2E8F79]/10">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E8F79]" />
                      <span>Your profile is fully complete and ready for applications!</span>
                    </div>
                  )}

                  {/* Link to Talent Web for CV/Files/Experience */}
                  <div className="pt-4 border-t border-[#D9CEDF]/50">
                    <a href={`${talentUrl}/profile/edit`} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        fullWidth
                        size="sm"
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Upload CV & Experience
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <ProfileContent />
    </AuthGuard>
  );
}
