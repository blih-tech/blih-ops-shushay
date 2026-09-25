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
  Badge,
} from "@blih/ui";
import { CompanyProfileSkeleton } from "@/components/profile/CompanyProfileSkeleton";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { CompanyContactFields } from "@/components/company/CompanyContactFields";
import { Save, ArrowLeft, Building, Sparkles } from "lucide-react";
import { getErrorMessage } from "@blih/api-client";

function CompanyProfileContent() {
  const { user, logout } = useAuth();
  const { profile, loading, error: fetchError, refetch } = useCompanyProfile();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

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
    return <CompanyProfileSkeleton user={user} logout={logout} />;
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <Alert variant="error" title="Load Error">
          {fetchError}
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !companyName.trim() ||
      !country.trim() ||
      !city.trim() ||
      !contactName.trim() ||
      !contactEmail.trim()
    ) {
      setError(
        "Please fill in all required fields (Company name, Location, Contact name & email).",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateCompanyProfile({
        companyName,
        description: description.trim() || null,
        website: website.trim() || null,
        country,
        city,
        contactName,
        contactEmail,
        contactPhone: contactPhone.trim() || null,
      });

      setSuccess("Company profile updated successfully!");
      refetch();
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to update company profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    await uploadCompanyLogo(file);
    refetch();
  };

  const handleLogoDelete = async () => {
    await deleteCompanyLogo();
    refetch();
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CEDF] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/company"
              className="text-[#6E6678] hover:text-[#1E5BFF] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
              Company Profile
            </h1>
            <Badge variant="primary" size="sm">
              RECRUITER
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-[#6E6678] font-sans">
            Manage your hiring brand details and primary contact information.
          </p>
        </div>

        <Link href="/company/subscription">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4 text-[#1E5BFF]" />}
          >
            Manage Subscription
          </Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border border-[#D9CEDF] shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-[#EEF3FF]/40 border-b border-[#D9CEDF]/70">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5 text-[#1E5BFF]" /> Organization Brand
            </CardTitle>
            <CardDescription>
              Public details visible to talents browsing company listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <LogoUpload
              value={profile?.logoUrl}
              onUpload={handleLogoUpload}
              onDelete={handleLogoDelete}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#D9CEDF]/60">
              <FormField label="Company Name" required>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Gebeya Technologies"
                />
              </FormField>

              <FormField label="Website URL">
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://gebeya.com"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Country" required>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Ethiopia"
                />
              </FormField>

              <FormField label="City" required>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Addis Ababa"
                />
              </FormField>
            </div>

            <FormField label="About the Organization">
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your company mission, hiring goals, and engineering culture..."
                maxLength={2000}
                showCharCount
              />
            </FormField>
          </CardContent>
        </Card>

        <CompanyContactFields
          contactName={contactName}
          setContactName={setContactName}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/company">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            disabled={saving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {saving ? "Saving Changes..." : "Save Company Profile"}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default function CompanyProfilePage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyProfileContent />
    </AuthGuard>
  );
}
