"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface SkillNode {
  id: string;
  label: string;
  status: "Verified" | "Developing" | "Recommended" | "Unverified";
  x: number;
  y: number;
  width: number;
  height: number;
  borderColor: string;
  bgColor: string;
  textColor: string;
  detail: string;
}

const SKILL_NODES: SkillNode[] = [
  {
    id: "js",
    label: "JavaScript",
    status: "Verified",
    x: 220,
    y: 170,
    width: 128,
    height: 58,
    borderColor: "border-[#1E5BFF]",
    bgColor: "bg-[#DDE7FF]",
    textColor: "text-[#1E5BFF]",
    detail: "Assessment 94 · 12 projects · 143 opportunities",
  },
  {
    id: "ts",
    label: "TypeScript",
    status: "Developing",
    x: 370,
    y: 90,
    width: 128,
    height: 58,
    borderColor: "border-[#D9CEDF]",
    bgColor: "bg-[#DDE7FF]",
    textColor: "text-[#6E6678]",
    detail: "Assessment 89 · 4 projects · 54 opportunities",
  },
  {
    id: "react",
    label: "React",
    status: "Verified",
    x: 390,
    y: 260,
    width: 128,
    height: 58,
    borderColor: "border-[#1E5BFF]",
    bgColor: "bg-white",
    textColor: "text-[#1E5BFF]",
    detail: "Assessment 91 · 3 projects · 76 opportunities",
  },
  {
    id: "a11y",
    label: "Accessibility",
    status: "Recommended",
    x: 150,
    y: 300,
    width: 158,
    height: 58,
    borderColor: "border-[#FF8A5B]",
    bgColor: "bg-white",
    textColor: "text-[#FF8A5B]",
    detail: "Curriculum target · 2 assessments recommended",
  },
  {
    id: "testing",
    label: "Testing",
    status: "Unverified",
    x: 460,
    y: 365,
    width: 128,
    height: 58,
    borderColor: "border-[#D9CEDF]",
    bgColor: "bg-white",
    textColor: "text-[#6E6678]",
    detail: "No active verification · 1 upcoming challenge",
  },
  {
    id: "api",
    label: "API Integration",
    status: "Verified",
    x: 70,
    y: 130,
    width: 158,
    height: 58,
    borderColor: "border-[#1E5BFF]",
    bgColor: "bg-[#DDE7FF]",
    textColor: "text-[#1E5BFF]",
    detail: "Assessment 88 · 8 projects · 92 opportunities",
  },
  {
    id: "perf",
    label: "Performance",
    status: "Developing",
    x: 230,
    y: 395,
    width: 128,
    height: 58,
    borderColor: "border-[#D9CEDF]",
    bgColor: "bg-white",
    textColor: "text-[#6E6678]",
    detail: "Assessment 78 · 1 project · 34 opportunities",
  },
];

export function SkillGraphPreview() {
  const [activeNodeId, setActiveNodeId] = useState("react");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  const activeNode = SKILL_NODES.find((n) => n.id === activeNodeId) || SKILL_NODES[2];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRevealRef = useRef<HTMLDivElement>(null);

  // Transition animation for selected details card at the bottom
  useGSAP(() => {
    if (detailRevealRef.current) {
      gsap.fromTo(
        detailRevealRef.current,
        { opacity: 0, scale: 0.96, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, { dependencies: [activeNodeId] });

  // Entrance and loop animations
  useGSAP(() => {
    // Initial draw-in of connection lines
    gsap.fromTo(
      ".connection-line",
      { opacity: 0, strokeDasharray: "4 4" },
      {
        opacity: 0.45,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".skill-node-container",
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Staggered pop-in for the skill cards/nodes
    gsap.fromTo(
      ".skill-node",
      { opacity: 0, scale: 0.3 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.5)",
        stagger: 0.1,
        delay: 0.4,
        scrollTrigger: {
          trigger: ".skill-node-container",
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Continuous loop: Pulse connection lines after reveal
    gsap.fromTo(
      ".connection-line",
      { opacity: 0.35 },
      { opacity: 0.75, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5, stagger: 0.25 }
    );
  }, { scope: containerRef });

  // Magnetic Pull Hover handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    setHoveredNodeId(nodeId);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(e.currentTarget, {
      x: x * 0.4,
      y: y * 0.4,
      scale: 1.08,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredNodeId(null);

    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1.2, 0.4)"
    });
  };

  const isLineActive = (n1: string, n2: string) => {
    const focusId = hoveredNodeId || activeNodeId;
    return focusId === n1 || focusId === n2;
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center font-sans select-none py-8">
      {/* Left Column: Heading and Copy */}
      <div className="lg:col-span-5 space-y-6">
        <h2 className="font-display text-5xl sm:text-6xl lg:text-[82px] font-bold tracking-tight text-[#17131F] leading-tight">
          Skill Graph
        </h2>
        <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed max-w-md">
          A functional map of verified, developing and recommended skills — with evidence, courses and opportunities attached.
        </p>
      </div>

      {/* Right Column: Visual Skill Graph Container */}
      <div className="lg:col-span-7 flex justify-center relative">
        <div className="skill-node-container w-full max-w-[640px] h-[560px] relative border border-[#D9CEDF]/40 rounded-[36px] bg-[#F7F9FF]/30 p-6 overflow-hidden">
          
          {/* Network Connection Lines SVG in background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
            {/* API -> JS */}
            <line
              className="connection-line transition-all duration-300"
              x1="149" y1="159" x2="284" y2="199"
              stroke={isLineActive("api", "js") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("api", "js") ? "2.5" : "1.5"}
              strokeDasharray={isLineActive("api", "js") ? "0" : "4 4"}
            />
            {/* JS -> TS */}
            <line
              className="connection-line transition-all duration-300"
              x1="284" y1="199" x2="434" y2="119"
              stroke={isLineActive("js", "ts") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("js", "ts") ? "2.5" : "1.5"}
              strokeDasharray={isLineActive("js", "ts") ? "0" : "4 4"}
            />
            {/* JS -> React */}
            <line
              className="connection-line transition-all duration-300"
              x1="284" y1="199" x2="454" y2="289"
              stroke={isLineActive("js", "react") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("js", "react") ? "3" : "2"}
              strokeDasharray={isLineActive("js", "react") ? "0" : "4 4"}
            />
            {/* React -> TS */}
            <line
              className="connection-line transition-all duration-300"
              x1="454" y1="289" x2="434" y2="119"
              stroke={isLineActive("react", "ts") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("react", "ts") ? "2.5" : "1.5"}
              strokeDasharray={isLineActive("react", "ts") ? "0" : "4 4"}
            />
            {/* React -> Testing */}
            <line
              className="connection-line transition-all duration-300"
              x1="454" y1="289" x2="524" y2="394"
              stroke={isLineActive("react", "testing") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("react", "testing") ? "2.5" : "1.5"}
              strokeDasharray={isLineActive("react", "testing") ? "0" : "4 4"}
            />
            {/* React -> A11y */}
            <line
              className="connection-line transition-all duration-300"
              x1="454" y1="289" x2="229" y2="329"
              stroke={isLineActive("react", "a11y") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("react", "a11y") ? "2.5" : "1.5"}
              strokeDasharray={isLineActive("react", "a11y") ? "0" : "4 4"}
            />
            {/* A11y -> Perf */}
            <line
              className="connection-line transition-all duration-300"
              x1="229" y1="329" x2="294" y2="424"
              stroke={isLineActive("a11y", "perf") ? "#1E5BFF" : "#D9CEDF"}
              strokeWidth={isLineActive("a11y", "perf") ? "2.5" : "1.5"}
              strokeDasharray={isLineActive("a11y", "perf") ? "0" : "4 4"}
            />
          </svg>

          {/* Interactive Skill Nodes */}
          {SKILL_NODES.map((n) => {
            const isActive = n.id === activeNodeId;
            return (
              <div
                key={n.id}
                onClick={() => setActiveNodeId(n.id)}
                onMouseMove={(e) => handleMouseMove(e, n.id)}
                onMouseLeave={handleMouseLeave}
                className={`skill-node absolute cursor-pointer border rounded-[18px] p-2 flex flex-col justify-center items-center transition-all shadow-sm ${n.bgColor} ${n.borderColor} ${
                  isActive ? "ring-2 ring-[#1E5BFF] ring-offset-2 scale-105 z-20" : ""
                }`}
                style={{
                  left: `${n.x}px`,
                  top: `${n.y}px`,
                  width: `${n.width}px`,
                  height: `${n.height}px`,
                  opacity: 0, // Initial opacity for entrance animation
                }}
              >
                <span className="font-display text-xs font-bold text-[#17131F] leading-none text-center">
                  {n.label}
                </span>
                <span className={`font-mono text-[8px] uppercase tracking-wider mt-1 leading-none ${n.textColor}`}>
                  {n.status}
                </span>
              </div>
            );
          })}

          {/* Selected skill reveal card at bottom */}
          <div ref={detailRevealRef} className="absolute left-[70px] top-[430px] w-[380px] h-[118px] bg-white border border-[#D9CEDF] rounded-[22px] p-6 shadow-md flex items-center justify-between transition-all duration-300">
            <div className="space-y-1">
              <h4 className="font-display text-xl font-bold text-[#17131F]">
                {activeNode.label} evidence
              </h4>
              <p className="font-mono text-[9px] text-[#6E6678] tracking-wide">
                {activeNode.detail}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EEF3FF] border border-[#1E5BFF]/10 flex items-center justify-center text-[#1E5BFF] font-bold text-xs select-none">
              →
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
