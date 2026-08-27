import React from "react";
import { Badge, SkillBar } from "../ui";

export interface CertificateCanvasProps {
  recipientName?: string;
  courseName?: string;
  issueDate?: string;
  credentialId?: string;
  score?: number;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  recipientName = "Sara Tesfaye",
  courseName = "React Product Systems & Architecture",
  issueDate = "August 2026",
  credentialId = "BLIH-CR-892401-VERIFIED",
  score = 94,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-white via-[#EEF3FF]/60 to-white border-2 border-[#D9CEDF] rounded-3xl p-5 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(30,91,255,0.08)] relative overflow-hidden space-y-6 sm:space-y-8">
      {/* Top watermark / branding */}
      <div className="flex items-center justify-between border-b border-[#D9CEDF]/80 pb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold tracking-tight text-[#1E5BFF]">
            Blih
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#6E6678]">
            Verified Digital Credential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="verified" size="md">
            Cryptographically Verified
          </Badge>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="text-center space-y-4 max-w-2xl mx-auto py-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#6E6678]">
          This certifies that
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#17131F] tracking-tight">
          {recipientName}
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#6E6678] leading-relaxed max-w-xl mx-auto">
          has successfully demonstrated production competency and passed all verified practical assessments in
        </p>
        <div className="py-2">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1E5BFF]">
            {courseName}
          </h3>
        </div>
      </div>

      {/* Competencies Verified */}
      <div className="bg-white/80 border border-[#D9CEDF] rounded-2xl p-6 max-w-xl mx-auto space-y-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E6678] block text-center">
          Verified Competency Breakdown
        </span>
        <SkillBar name="Architecture & State" score={score} status="Verified" variant="primary" />
        <SkillBar name="Practical Assessment" score={92} status="Verified" variant="verified" />
      </div>

      {/* Certificate Footer / Proof Signature */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#D9CEDF]/80 pt-6 gap-4 text-xs font-mono text-[#6E6678]">
        <div>
          <span className="block font-semibold text-[#17131F]">Issued by Blih Ops Evaluation</span>
          <span>Date: {issueDate}</span>
        </div>

        <div className="text-center sm:text-right">
          <span className="block font-semibold text-[#17131F]">Credential ID:</span>
          <span className="text-[#1E5BFF]">{credentialId}</span>
        </div>
      </div>
    </div>
  );
};
