"use client";

import React from "react";
import { FileText } from "lucide-react";
import { Modal, Button } from "@blih/ui";
import type { AdminTalentItem } from "@/types/admin";

interface TalentInspectModalProps {
  talent: AdminTalentItem | null;
  onClose: () => void;
}

export function TalentInspectModal({
  talent,
  onClose,
}: TalentInspectModalProps) {
  if (!talent) return null;

  return (
    <Modal isOpen={!!talent} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-[#D9CEDF]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-xl overflow-hidden shrink-0 shadow-sm">
              {talent.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={talent.photoUrl}
                  alt="Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {(talent.fullName || talent.user.email)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#17131F]">
                {talent.fullName || "Candidate Details"}
              </h2>
              <p className="text-sm font-mono text-[#1E5BFF] font-medium">
                {talent.title || "Talent Member"}
              </p>
              <p className="text-xs text-[#6E6678]">{talent.user.email}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {talent.bio && (
          <div className="space-y-1">
            <p className="text-xs font-mono text-[#6E6678] uppercase">
              Technical Overview
            </p>
            <p className="text-sm text-[#17131F] leading-relaxed bg-[#EEF3FF]/40 p-4 rounded-2xl border border-[#D9CEDF]/70">
              {talent.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {talent.skills && talent.skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-mono text-[#6E6678] uppercase">
              Verified Competencies
            </p>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map((skill, si) => (
                <span
                  key={si}
                  className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/20 text-xs font-mono text-[#1E5BFF] font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {talent.experience.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-mono text-[#6E6678] uppercase">
              Work History
            </p>
            <div className="space-y-2">
              {talent.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 bg-white border border-[#D9CEDF] rounded-2xl"
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-[#17131F]">
                      {exp.title}
                    </p>
                    <span className="text-xs font-mono text-[#6E6678]">
                      {exp.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#D9CEDF]">
          {talent.cvUrl && (
            <a
              href={talent.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Download Attached CV
              </Button>
            </a>
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
