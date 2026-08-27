"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Building2, MapPin, Phone, Globe,
  ExternalLink, Mail, CheckCircle2, User
} from "lucide-react";
import {
  Button, Badge, Alert, Spinner, Card, CardHeader, CardTitle, CardContent,
  GlobalNavbar, UniversalSearch
} from "@/components/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { apiFetch } from "@/lib/api";

interface CompanyItem {
  id: string;
  userId: string;
  companyName: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

function AdminCompaniesContent() {
  const { user, logout } = useAuth();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<CompanyItem[]>("/admin/companies");
        setCompanies(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load company records");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (c.companyName && c.companyName.toLowerCase().includes(q)) ||
      (c.user.email && c.user.email.toLowerCase().includes(q)) ||
      (c.contactName && c.contactName.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col font-sans antialiased relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="admin" user={user} onSignOut={logout} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
          <div className="space-y-1.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Hub
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                Company Management
              </h1>
              <Badge variant="primary">{companies.length} REGISTERED</Badge>
            </div>
            <p className="text-sm text-[#6E6678]">
              Manage hiring organizations, verification credentials, job posting allowances, and contact reachability.
            </p>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Search Bar */}
        <div className="max-w-md">
          <UniversalSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name, location, contact, or email..."
          />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="border-2 border-dashed border-[#D9CEDF] rounded-3xl p-12 text-center bg-white space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#17131F]">No companies registered</h3>
            <p className="text-sm text-[#6E6678] max-w-sm mx-auto">
              {searchQuery ? "No companies match your search query." : "Hiring company accounts will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((comp) => (
              <Card
                key={comp.id}
                className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden flex flex-col justify-between hover:border-[#1E5BFF]/50 transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center font-display font-bold text-lg overflow-hidden shrink-0 shadow-xs">
                      {comp.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={comp.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(comp.companyName || comp.user.email).charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold text-[#17131F] truncate">
                        {comp.companyName || "Hiring Organization"}
                      </h3>
                      <p className="text-xs text-[#6E6678] truncate">{comp.user.email}</p>
                    </div>
                  </div>

                  {comp.description && (
                    <p className="text-xs text-[#6E6678] font-sans line-clamp-3 leading-relaxed">
                      {comp.description}
                    </p>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-[#D9CEDF]/60 text-xs font-sans text-[#6E6678]">
                    {comp.city && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
                        <span>{comp.city}{comp.country ? `, ${comp.country}` : ""}</span>
                      </p>
                    )}
                    {comp.website && (
                      <p className="flex items-center gap-2 truncate">
                        <Globe className="h-3.5 w-3.5 text-[#1E5BFF]" />
                        <a href={comp.website.startsWith("http") ? comp.website : `https://${comp.website}`} target="_blank" rel="noreferrer" className="text-[#1E5BFF] hover:underline truncate">
                          {comp.website}
                        </a>
                      </p>
                    )}
                    {comp.contactPhone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#1E5BFF]" />
                        <span>{comp.contactPhone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#EEF3FF]/30 border-t border-[#D9CEDF]/70 flex items-center justify-between text-xs font-mono text-[#6E6678]">
                  <span>Member since {new Date(comp.createdAt).getFullYear()}</span>
                  <Badge variant="verified" size="sm">ACTIVE</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminCompaniesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminCompaniesContent />
    </AuthGuard>
  );
}
