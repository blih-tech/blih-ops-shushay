"use client";

import React, { useEffect, useRef, useState } from "react";

interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  items: SectionNavItem[];
}

export function SectionNav({ items }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      // Find the topmost intersecting entry
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0,
    });

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="space-y-0.5">
      <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
        Sections
      </p>
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`
              w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-interactive
              ${
                active
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }
            `}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                active ? "bg-primary" : "bg-border"
              }`}
            />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
