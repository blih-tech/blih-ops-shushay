"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import {
  updateCompanyProfile,
  uploadCompanyLogo,
  deleteCompanyLogo,
} from "@/lib/companyApi";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, FormField, Alert, Spinner } from "@/components/ui";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { ArrowLeft, Save, Building, User, Mail, Phone, Globe } from "lucide-react";

function CompanyProfileContent() {
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
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center space-y-2">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground font-sans animate-pulse">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-16 p-4">
        <Alert variant="error" title="Load Error">
          {fetchError}
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!companyName.trim() || !country.trim() || !city.trim() || !contactName.trim() || !contactPhone.trim()) {
      setError("Company Name, Country, City, Contact Name, and Contact Phone are required.");
      return;
    }

    setSaving(true);
    try {
      await updateCompanyProfile({
        companyName,
        description: description.trim() || null,
        website: website.trim() || null,
        country,
        city,
        contactName,
        contactEmail: contactEmail.trim() || null,
        contactPhone,
      });
      setSuccess("Company profile details updated successfully.");
      await refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.message || "Failed to update company profile details.");
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
    <div className="min-h-screen bg-muted py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Link href="/company">
              <Button variant="outline" size="sm" className="p-2 min-h-0 h-9 w-9" aria-label="Go back to portal">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Company Profile</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Set up and manage your company profile visible to talents.
              </p>
            </div>
          </div>
          <Link href="/company">
            <Button variant="secondary" size="sm">Back to Portal</Button>
          </Link>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Fields (2/3 width) */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-border shadow-sm">
              <CardHeader className="p-6 sm:p-8 bg-muted/10 border-b border-border">
                <CardTitle className="text-lg font-serif text-foreground">Company details</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-0.5">General details about your company.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <FormField label="Company Name" required>
                  <Input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    leftIcon={<Building className="h-4 w-4 text-muted-foreground" />}
                    disabled={saving}
                  />
                </FormField>

                <FormField label="Website URL">
                  <Input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://www.acme.com"
                    leftIcon={<Globe className="h-4 w-4 text-muted-foreground" />}
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

                <FormField label="Company Description">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description about your company, industry, missions..."
                    maxLength={1000}
                    disabled={saving}
                    rows={4}
                  />
                </FormField>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader className="p-6 sm:p-8 bg-muted/10 border-b border-border">
                <CardTitle className="text-lg font-serif text-foreground">Contact Information</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-0.5">Information for candidate contacts and platform updates.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <FormField label="Contact Person Name" required>
                  <Input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                    disabled={saving}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Contact Email">
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. recruitment@acme.com"
                      leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                      disabled={saving}
                    />
                  </FormField>

                  <FormField label="Contact Phone" required>
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 15) setContactPhone(val);
                      }}
                      placeholder="e.g. +49301234567"
                      maxLength={15}
                      leftIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                      disabled={saving}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo Upload Sidebar (1/3 width) */}
          <div className="space-y-6">
            <Card className="border border-border shadow-sm">
              <CardHeader className="p-6 border-b border-border bg-muted/10">
                <CardTitle className="text-base font-serif text-foreground">Branding</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <LogoUpload
                  value={profile?.logoUrl}
                  onUpload={handleLogoUpload}
                  onDelete={handleLogoDelete}
                />

                <div className="border-t border-border pt-4 mt-6">
                  <Button
                    type="submit"
                    isLoading={saving}
                    fullWidth
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save All Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
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
