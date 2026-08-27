"use client";

import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col">
      {children}
    </div>
  );
}
