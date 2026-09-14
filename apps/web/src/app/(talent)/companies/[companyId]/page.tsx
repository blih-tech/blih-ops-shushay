"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatPhone } from "@/lib/formatPhone";
import { Button, Badge, Alert, Card } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { getCompanyById } from "@blih/api-client";

interface PageProps {
  params: Promise<{ companyId: string }>;
}

interface CompanyData {
  id: string;
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
  jobs: Array<{
    id: string;
    title: string;
    description: string;
    employmentType: string;
    experienceLevel: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string;
    salaryDisplay: string | null;
    countryRestrictions: string[];
    createdAt: string;
  }>;
}

function CompanyProfileContent({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanyById(companyId);
      setCompany(data);
    } catch (err: any) {
      setError(err.message || "Failed to load company profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-[#6E6678]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
          <span className="font-mono text-xs">Loading company details...</span>
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
        </Link>
        <Alert variant="error" title="Company Not Found">
          {error || "The requested company profile could not be found."}
        </Alert>
      </main>
    );
  }

  const companyName = company.companyName || "Hiring Organization";
  const location = [company.city, company.country].filter(Boolean).join(", ");

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
      </Link>

      {/* Company Profile Hero Card */}
      <div className="bg-white border border-[#D9CEDF] rounded-3xl shadow-sm overflow-hidden space-y-0">
        {/* Cover Banner */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-[#17131F] via-[#1E5BFF]/90 to-[#2E8F79]/85 relative overflow-hidden flex items-end justify-end p-4">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Profile Content Body */}
        <div className="px-6 sm:px-10 pb-8 space-y-6">
          {/* Avatar & Header Actions */}
          <div className="-mt-12 sm:-mt-16 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-md border-4 border-white overflow-hidden flex items-center justify-center shrink-0 relative">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={companyName}
                    className="w-full h-full rounded-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#EEF3FF] border border-[#1E5BFF]/20 flex items-center justify-center text-[#1E5BFF]">
                    <Building2 className="w-10 h-10 stroke-[1.75]" />
                  </div>
                )}
              </div>

              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                    {companyName}
                  </h1>
                  <Badge variant="verified">Verified Employer</Badge>
                </div>
                {location && (
                  <div className="flex items-center gap-1.5 text-xs font-sans text-[#6E6678]">
                    <MapPin className="h-3.5 w-3.5 text-[#1E5BFF] shrink-0" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>

            {company.website && (
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#D9CEDF] rounded-xl text-xs font-mono text-[#1E5BFF] hover:bg-[#EEF3FF] transition-colors shrink-0 self-start sm:self-auto"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Visit Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Company Description */}
          <div className="pt-4 border-t border-[#D9CEDF]/60 space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#17131F]">
              About Organization
            </h3>
            <p className="text-sm text-[#6E6678] leading-relaxed font-sans">
              {company.description || "No description provided."}
            </p>
          </div>

          {/* Contact Info Footer */}
          {(company.contactName ||
            company.contactEmail ||
            company.contactPhone) && (
            <div className="pt-4 border-t border-[#D9CEDF]/60 flex flex-wrap gap-6 text-xs text-[#6E6678]">
              {company.contactName && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#17131F]">
                    Contact Person:
                  </span>{" "}
                  {company.contactName}
                </div>
              )}
              {company.contactEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#1E5BFF]" />
                  <a
                    href={`mailto:${company.contactEmail}`}
                    className="text-[#1E5BFF] hover:underline"
                  >
                    {company.contactEmail}
                  </a>
                </div>
              )}
              {company.contactPhone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#1E5BFF]" />
                  <span>{formatPhone(company.contactPhone)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#17131F] flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#1E5BFF]" />
            <span>Open Positions ({company.jobs.length})</span>
          </h2>
        </div>

        {company.jobs.length === 0 ? (
          <Card className="p-8 text-center text-sm text-[#6E6678] border-[#D9CEDF]">
            This organization does not have any open positions listed at the
            moment.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {company.jobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 bg-white border border-[#D9CEDF] hover:border-[#1E5BFF]/50 transition-all rounded-2xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-display text-lg font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-[#6E6678] mt-1">
                      <Badge variant="default">
                        {job.employmentType.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="primary">
                        {job.experienceLevel} LEVEL
                      </Badge>
                      {job.salaryDisplay && (
                        <span className="font-mono text-[#2E8F79] font-semibold">
                          {job.salaryDisplay}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <Button size="sm" variant="outline">
                      View Job & Apply →
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-[#6E6678] line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CompanyProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT", "COMPANY", "ADMIN"]}>
      <CompanyProfileContent companyId={resolvedParams.companyId} />
    </AuthGuard>
  );
}
