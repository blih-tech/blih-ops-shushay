"use client";

import React, { useState, useRef } from "react";
import { Button } from "@blih/ui";
import { Search, Heart, Mail } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Candidate {
  id: string;
  name: string;
  role: string;
  availability: string;
  avatarInitials: string;
  skills: { name: string; score: number; status: string; width: string; color: string }[];
  evidence: string[];
}

const CANDIDATES: Candidate[] = [
  {
    id: "mikael",
    name: "Mikael Abebe",
    role: "Frontend Engineer",
    availability: "Available in 2 weeks",
    avatarInitials: "MA",
    skills: [
      { name: "React", score: 94, status: "Verified", width: "92%", color: "bg-[#1E5BFF]" },
      { name: "TypeScript", score: 89, status: "Verified", width: "87%", color: "bg-[#1E5BFF]" },
      { name: "Accessibility", score: 82, status: "Developing", width: "78%", color: "bg-[#FF8A5B]" },
    ],
    evidence: [
      "4 verified assessments",
      "12 completed projects",
      "17 client reviews",
      "3 professional certificates",
    ],
  },
  {
    id: "ruth",
    name: "Ruth Bekele",
    role: "Product Engineer",
    availability: "Available immediately",
    avatarInitials: "RB",
    skills: [
      { name: "React", score: 91, status: "Verified", width: "89%", color: "bg-[#1E5BFF]" },
      { name: "Node.js", score: 85, status: "Verified", width: "83%", color: "bg-[#1E5BFF]" },
      { name: "System Design", score: 76, status: "Developing", width: "72%", color: "bg-[#FF8A5B]" },
    ],
    evidence: [
      "3 verified assessments",
      "9 completed projects",
      "11 client reviews",
      "2 professional certificates",
    ],
  },
  {
    id: "hana",
    name: "Hana Yusuf",
    role: "UI Developer",
    availability: "Available next month",
    avatarInitials: "HY",
    skills: [
      { name: "Figma", score: 95, status: "Verified", width: "93%", color: "bg-[#1E5BFF]" },
      { name: "React", score: 88, status: "Verified", width: "86%", color: "bg-[#1E5BFF]" },
      { name: "CSS/Tailwind", score: 92, status: "Verified", width: "90%", color: "bg-[#1E5BFF]" },
    ],
    evidence: [
      "5 verified assessments",
      "15 completed projects",
      "22 client reviews",
      "4 professional certificates",
    ],
  },
  {
    id: "solomon",
    name: "Solomon Desta",
    role: "Backend leaning FE",
    availability: "Available in 3 weeks",
    avatarInitials: "SD",
    skills: [
      { name: "React", score: 80, status: "Verified", width: "78%", color: "bg-[#1E5BFF]" },
      { name: "Python/Django", score: 92, status: "Verified", width: "90%", color: "bg-[#1E5BFF]" },
      { name: "PostgreSQL", score: 87, status: "Verified", width: "85%", color: "bg-[#1E5BFF]" },
    ],
    evidence: [
      "6 verified assessments",
      "18 completed projects",
      "31 client reviews",
      "5 professional certificates",
    ],
  },
];

export function TalentExplorerPreview() {
  const [selectedId, setSelectedId] = useState("mikael");
  const selectedCandidate = CANDIDATES.find((c) => c.id === selectedId) || CANDIDATES[0];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Transition animation for selected details card when selection changes
  useGSAP(() => {
    if (detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        detailRef.current.querySelectorAll(".detail-progress-fill"),
        { width: 0 },
        { width: (i, el: any) => el.dataset.width, duration: 0.8, ease: "power2.out", delay: 0.1, stagger: 0.08 }
      );
    }
  }, { dependencies: [selectedId] });

  // Scroll Trigger staggered entrance for the left panel items
  useGSAP(() => {
    gsap.fromTo(
      ".candidate-card-item",
      { opacity: 0, x: -35 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef });

  const onItemEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      x: 6,
      scale: 1.01,
      duration: 0.25,
      ease: "power1.out"
    });
  };

  const onItemLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      scale: 1,
      duration: 0.25,
      ease: "power1.out"
    });
  };

  return (
    <div ref={containerRef} className="space-y-10 font-sans select-none">
      {/* Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[68px] font-bold tracking-tight text-[#17131F] leading-[1.05]">
            Discover people by<br />what they can prove.
          </h2>
        </div>
        <div className="lg:col-span-4 lg:pt-8">
          <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
            An interactive hiring surface where evidence matters more than claims.
          </p>
        </div>
      </div>

      {/* Explorer UI Shell */}
      <div className="bg-white border border-[#D9CEDF] rounded-[34px] p-6 sm:p-8 shadow-[0_24px_54px_rgba(30,91,255,0.06)] space-y-6">
        
        {/* Search & Filters Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pb-6 border-b border-[#D9CEDF]/60">
          {/* Search bar mock */}
          <div className="flex-1 max-w-[520px] bg-[#F7F9FF] border border-[#D9CEDF] rounded-2xl px-5 h-14 flex items-center justify-between">
            <span className="text-sm text-[#17131F] font-medium">React TypeScript product engineer</span>
            <Search className="w-4 h-4 text-[#1E5BFF]" />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-[#DDE7FF] border border-[#1E5BFF] text-[#1E5BFF] rounded-full px-3 py-1 text-xs font-mono">React</span>
            <span className="bg-[#DDE7FF] border border-[#1E5BFF] text-[#1E5BFF] rounded-full px-3 py-1 text-xs font-mono">TypeScript</span>
            <span className="bg-white border border-[#D9CEDF] text-[#6E6678] rounded-full px-3 py-1 text-xs font-mono">Remote</span>
            <span className="bg-white border border-[#D9CEDF] text-[#6E6678] rounded-full px-3 py-1 text-xs font-mono">Available now</span>
            <span className="font-mono text-xs text-[#6E6678] ml-4 hidden xl:inline">1,280 matching professionals</span>
          </div>
        </div>

        {/* Workspace content split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: List of candidates */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {CANDIDATES.map((c) => {
              const isSelected = c.id === selectedId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  onMouseEnter={onItemEnter}
                  onMouseLeave={onItemLeave}
                  className={`candidate-card-item cursor-pointer rounded-2xl p-4 border flex items-center gap-4 ${
                    isSelected
                      ? "bg-[#DDE7FF] border-[#1E5BFF] shadow-sm scale-[0.98]"
                      : "bg-white border-[#D9CEDF] hover:bg-[#EEF3FF]/40"
                  }`}
                  style={{ opacity: 0 }}
                >
                  <div className="w-[42px] h-[42px] rounded-full bg-[#EEF3FF] border border-[#1E5BFF]/10 flex items-center justify-center font-display font-bold text-xs text-[#1E5BFF] shrink-0">
                    {c.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#17131F] truncate leading-tight">{c.name}</h4>
                    <p className="text-xs text-[#6E6678] mt-0.5 truncate">{c.role}</p>
                  </div>
                  {isSelected && (
                    <span className="font-mono text-[9px] text-[#1E5BFF] uppercase tracking-wider font-semibold">Active</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right panel: Candidate Detailed Proof View */}
          <div ref={detailRef} className="lg:col-span-8 bg-white border border-[#D9CEDF] rounded-[26px] p-6 sm:p-8 flex flex-col justify-between min-h-[350px] shadow-sm">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-3xl sm:text-[38px] font-bold text-[#17131F] leading-none">
                  {selectedCandidate.name}
                </h3>
                <span className="font-mono text-xs text-[#1E5BFF] uppercase tracking-wider block font-semibold">
                  {selectedCandidate.role} · {selectedCandidate.availability}
                </span>
              </div>
            </div>

            {/* Content body split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start my-8">
              
              {/* Skill bars */}
              <div className="md:col-span-7 space-y-5">
                {selectedCandidate.skills.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#17131F] w-[90px] shrink-0">{s.name}</span>
                    <div className="flex-1 bg-[#E8E0EF] h-2 rounded-full overflow-hidden relative mx-4">
                      <div className={`${s.color} h-full rounded-full detail-progress-fill`} data-width={s.width} />
                    </div>
                    <div className="w-[60px] text-right font-mono text-[10px] text-[#1E5BFF]">
                      <span className="font-display text-lg font-bold block">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Evidence details list */}
              <div className="md:col-span-5 bg-[#F7F9FF] border border-[#D9CEDF]/60 rounded-2xl p-5 space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#6E6678] tracking-wider block font-semibold mb-1">
                  Verified Evidence
                </span>
                {selectedCandidate.evidence.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1E5BFF]" />
                    <span className="font-mono text-xs text-[#6E6678] font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-[#D9CEDF]/60">
              <Button size="sm" variant="outline" leftIcon={<Mail className="w-3.5 h-3.5" />}>
                View Profile
              </Button>
              <Button size="sm" variant="outline" leftIcon={<Heart className="w-3.5 h-3.5" />}>
                Save
              </Button>
              <Button size="sm" variant="coral">
                Invite to Opportunity
              </Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
