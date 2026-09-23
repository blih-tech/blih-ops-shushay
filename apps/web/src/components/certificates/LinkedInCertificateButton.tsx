import React from "react";
import { Button } from "@blih/ui";

interface LinkedInCertificateButtonProps {
  courseTitle: string;
  certificateNumber: string;
  issueDate?: string | Date;
  courseId?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function buildLinkedInCertificateUrl({
  courseTitle,
  certificateNumber,
  issueDate,
  courseId,
}: {
  courseTitle: string;
  certificateNumber: string;
  issueDate?: string | Date;
  courseId?: string;
}) {
  const d = issueDate ? new Date(issueDate) : new Date();
  const year = isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  const month = isNaN(d.getTime()) ? new Date().getMonth() + 1 : d.getMonth() + 1;

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://blih.com";
  const certUrl = courseId
    ? `${origin}/certificates?courseId=${courseId}`
    : `${origin}/certificates`;

  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: courseTitle,
    organizationName: "Blih",
    issueYear: String(year),
    issueMonth: String(month),
    certUrl,
    certId: certificateNumber,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

export function LinkedInCertificateButton({
  courseTitle,
  certificateNumber,
  issueDate,
  courseId,
  variant = "outline",
  size = "sm",
  className = "",
}: LinkedInCertificateButtonProps) {
  const shareUrl = buildLinkedInCertificateUrl({
    courseTitle,
    certificateNumber,
    issueDate,
    courseId,
  });

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
    >
      <Button
        variant={variant}
        size={size}
        leftIcon={<LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />}
        className="border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2] transition-colors font-medium"
      >
        Add to LinkedIn
      </Button>
    </a>
  );
}
