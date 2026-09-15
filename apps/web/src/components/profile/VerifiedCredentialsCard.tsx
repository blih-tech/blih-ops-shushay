import React from "react";
import { Badge } from "@blih/ui";
import { ShieldCheck, Award, Download } from "lucide-react";
import { getCertificateDownloadUrl } from "@blih/api-client";

export interface VerifiedCredentialsCardProps {
  certificates?: any[];
  completedCourses?: any[];
}

export function getUniqueCertificates(
  certificates?: any[],
  completedCourses?: any[],
): any[] {
  const rawItems = certificates?.length ? certificates : completedCourses || [];
  return rawItems.reduce((acc: any[], item: any) => {
    const titleKey =
      item.course?.title?.trim() || item.title?.trim() || item.id;
    if (
      !acc.some(
        (i) =>
          (i.course?.title?.trim() || i.title?.trim() || i.id) === titleKey,
      )
    ) {
      acc.push(item);
    }
    return acc;
  }, []);
}

export const VerifiedCredentialsCard: React.FC<
  VerifiedCredentialsCardProps
> = ({ certificates, completedCourses }) => {
  const items = getUniqueCertificates(certificates, completedCourses);
  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
      <div className="space-y-1 pb-4 border-b border-[#D9CEDF]/70 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2E8F79] font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E8F79]" />
            <span>Verified Blih Credentials</span>
          </span>
          <h2 className="font-display text-2xl font-bold text-[#17131F]">
            Completed Courses & Certificates
          </h2>
        </div>
        <Badge variant="verified" size="md">
          {items.length} Verified
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((cert: any, idx: number) => {
          const certId = cert.id || cert.certificateId;
          const title =
            cert.course?.title || cert.title || "Blih Skills Course";
          const certNumber = cert.certificateNumber || "BLIH-CERT-VERIFIED";
          const issueDate = cert.issueDate || cert.completedAt;

          return (
            <div
              key={certId || idx}
              className="p-5 rounded-2xl border border-[#D9CEDF] bg-[#EEF3FF]/40 hover:border-[#1E5BFF]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#1E5BFF] bg-[#EEF3FF] px-2.5 py-0.5 rounded-md font-semibold border border-[#1E5BFF]/20">
                    Verified Track
                  </span>
                  <Award className="w-5 h-5 text-[#1E5BFF]" />
                </div>
                <h4 className="font-display text-lg font-bold text-[#17131F]">
                  {title}
                </h4>
                <p className="font-mono text-xs text-[#6E6678]">
                  ID: {certNumber}
                </p>
                {issueDate && (
                  <p className="font-sans text-xs text-[#6E6678]">
                    Issued:{" "}
                    {new Date(issueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {certId && (
                <a
                  href={getCertificateDownloadUrl(certId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-2 border-t border-[#D9CEDF]/50 flex items-center justify-between font-mono text-xs text-[#1E5BFF] hover:underline font-medium"
                >
                  <span>Download Verified Certificate</span>
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
