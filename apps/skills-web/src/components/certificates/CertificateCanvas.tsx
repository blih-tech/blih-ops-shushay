import React from "react";
import { ShieldCheck, Award } from "lucide-react";
import { BlihLogoSvg } from "./BlihLogoSvg";

export interface CertificateCanvasProps {
  recipientName?: string;
  courseName?: string;
  issueDate?: string;
  credentialId?: string;
  score?: number;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  recipientName = "Shushay Kebedew",
  courseName = "React Fundamentals",
  issueDate = "September 3, 2026",
  credentialId = "BLIH-CERT-8F3A92",
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[#FDFBFD] via-[#F4F7FF] to-[#FDFBFD] border-2 border-[#1E5BFF]/30 rounded-3xl p-6 sm:p-12 md:p-14 shadow-[0_20px_60px_rgba(30,91,255,0.07)] relative overflow-hidden text-center space-y-6 sm:space-y-8 select-none antialiased">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#1E5BFF]/10 blur-3xl pointer-events-none -z-10" />

      {/* 1. Header: Logo & Brand Name Side-by-Side */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
        <div className="p-2 rounded-2xl bg-white shadow-sm border border-[#D9CEDF]/70 shrink-0">
          <BlihLogoSvg className="w-9 h-9 sm:w-12 sm:h-12" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17131F]">
              BLIH
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-[#1E5BFF] bg-[#EEF3FF] px-2.5 py-0.5 rounded-full font-bold border border-[#1E5BFF]/20 uppercase">
              SKILLS
            </span>
          </div>
          <p className="font-mono text-[10px] sm:text-xs text-[#6E6678] font-medium">
            Verified Learning Ecosystem
          </p>
        </div>
      </div>

      {/* 2. Certificate Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-[0.2em] text-[#17131F]">
          Certificate of Completion
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#1E5BFF] to-transparent mx-auto rounded-full" />
      </div>

      {/* 3. Recipient */}
      <div className="space-y-2 max-w-xl mx-auto py-1">
        <p className="font-sans text-xs sm:text-sm uppercase tracking-widest text-[#6E6678] font-semibold">
          This certifies that
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#17131F] tracking-tight break-words px-2">
          {recipientName}
        </h2>
      </div>

      {/* 4. Course */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <p className="font-sans text-xs sm:text-base text-[#6E6678] font-normal">
          has successfully completed the verified practical course in
        </p>
        <h3 className="font-display text-xl sm:text-3xl md:text-4xl font-bold text-[#1E5BFF] px-2">
          {courseName}
        </h3>
      </div>

      {/* 5. Date & Certificate No */}
      <div className="pt-2 sm:pt-4 space-y-4 max-w-md mx-auto">
        <p className="font-mono text-xs sm:text-sm text-[#6E6678] font-semibold">
          {issueDate}
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 font-mono text-xs sm:text-sm bg-white border border-[#D9CEDF] text-[#17131F] px-4 sm:px-6 py-2.5 rounded-2xl shadow-sm ring-1 ring-[#1E5BFF]/10">
          <ShieldCheck className="w-4 h-4 text-[#00A859] shrink-0" />
          <span className="text-[#6E6678] font-medium">Certificate No:</span>
          <span className="font-bold text-[#1E5BFF] select-all">{credentialId}</span>
        </div>
      </div>

      {/* 6. Footer */}
      <div className="pt-4 sm:pt-6 border-t border-[#D9CEDF]/70 flex items-center justify-center gap-2 text-xs font-mono text-[#6E6678]">
        <Award className="w-4 h-4 text-[#1E5BFF]" />
        <span className="font-bold text-[#17131F]">Blih Skills</span>
        <span>·</span>
        <span>Cryptographically Verified Credential</span>
      </div>
    </div>
  );
};
