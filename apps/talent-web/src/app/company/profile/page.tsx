"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/providers/AuthProvider";
import {
  updateCompanyProfile,
  uploadCompanyLogo,
  deleteCompanyLogo,
} from "@/lib/companyApi";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  FormField,
  Alert,
  Spinner,
  GlobalNavbar,
  Badge,
} from "@/components/ui";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { ArrowLeft, Save, Building, User, Mail, Phone, Globe, Sparkles } from "lucide-react";

function CompanyProfileContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error: fetchError, refetch } = useCompanyProfile();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Populate form states
  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || "");
      setDescription(profile.description || "");
      setWebsite(profile.website || "");
      setCountry(profile.country || "");
      setCity(profile.city || "");
      setContactName(profile.contactName || "");
      setContactEmail(profile.contactEmail || "");
      setContactPhone(profile.contactPhone || "");
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalNavbar currentApp="explore" user={user} onSignOut={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3 font-sans">
            <Spinner size="lg" />
            <p className="text-sm text-[#6E6678] animate-pulse">Loading company profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalNavbar currentApp="explore" user={user} onSignOut={logout} />
        <div className="max-w-md mx-auto mt-16 p-4">
          <Alert variant="error" title="Load Error">
            {fetchError}
          </Alert>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !country.trim() || !city.trim() || !contactName.trim() || !contactEmail.trim()) {
      setError("Please fill in all required fields (Company name, Location, Contact name & email).");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateCompanyProfile({
        companyName: companyName.trim(),
        description: description.trim() || null,
        website: website.trim() || null,
        country: country.trim(),
        city: city.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || null,
      });
      setSuccess("Company profile updated successfully.");
      await refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.message || "Failed to update company profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    await uploadCompanyLogo(file);
    await refetch();
  };

  const handleLogoDelete = async () => {
    await deleteCompanyLogo();
    await refetch();
  };

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col font-sans antialiased relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      <GlobalNavbar currentApp="explore" user={user} onSignOut={logout} />

      <main className="max-w-6xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* Navigation Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
          <div className="space-y-1">
            <Link
              href="/company"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Hiring Portal
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                Company Profile
              </h1>
              <Badge variant="primary">COMPANY</Badge>
            </div>
            <p className="text-sm text-[#6E6678]">
              Manage your company information and brand assets presented to candidates.
            </p>
          </div>
          <Link href="/company">
            <Button variant="outline" size="sm">Back to Portal</Button>
          </Link>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info Fields */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-sm">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-display text-[#17131F]">
                      Company Details
                    </CardTitle>
                    <CardDescription className="text-sm text-[#6E6678]">
                      General organizational identity and website.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-5 bg-white">
                <FormField label="Company Name" required>
                  <Input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    leftIcon={<Building className="h-4 w-4 text-[#6E6678]" />}
                    disabled={saving}
                  />
                </FormField>

                <FormField label="Website URL">
                  <Input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://www.acme.com"
                    leftIcon={<Globe className="h-4 w-4 text-[#6E6678]" />}
                    disabled={saving}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Country" required>
                    <Input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Germany"
                      disabled={saving}
                    />
                  </FormField>

                  <FormField label="City" required>
                    <Input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Berlin"
                      disabled={saving}
                    />
                  </FormField>
                </div>

                <FormField label="Company Description & Mission">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description about your company, culture, industry focus, and vision..."
                    maxLength={1000}
                    disabled={saving}
                    rows={4}
                  />
                </FormField>
              </CardContent>
            </Card>

            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-display text-[#17131F]">
                      Hiring Contact
                    </CardTitle>
                    <CardDescription className="text-sm text-[#6E6678]">
                      Primary recruiter or representative point of contact.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-5 bg-white">
                <FormField label="Contact Person Name" required>
                  <Input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    leftIcon={<User className="h-4 w-4 text-[#6E6678]" />}
                    disabled={saving}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Contact Email" required>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. hiring@acme.com"
                      leftIcon={<Mail className="h-4 w-4 text-[#6E6678]" />}
                      disabled={saving}
                    />
                  </FormField>

                  <FormField label="Contact Phone">
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. +49 30 1234567"
                      leftIcon={<Phone className="h-4 w-4 text-[#6E6678]" />}
                      disabled={saving}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={saving}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Company Profile
              </Button>
            </div>
          </div>

          {/* Logo Upload Sidebar */}
          <div className="lg:col-span-4">
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden sticky top-28">
              <CardHeader className="p-6 border-b border-[#D9CEDF] bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white">
                <CardTitle className="text-lg font-bold font-display text-[#17131F]">
                  Brand Logo
                </CardTitle>
                <CardDescription className="text-xs text-[#6E6678]">
                  Display logo for jobs and candidate communications.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <LogoUpload
                  value={profile?.logoUrl}
                  onUpload={handleLogoUpload}
                  onDelete={handleLogoDelete}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CompanyProfilePage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyProfileContent />
    </AuthGuard>
  );
}
