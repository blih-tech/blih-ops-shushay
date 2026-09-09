"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export interface UniversalSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  shortcut?: string;
  actionText?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({
  placeholder = "What do you want to learn, do, or hire for?",
  onSearch,
  shortcut = "⌘K",
  actionText = "Search",
  className = "",
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState("");
  const inputValue = value !== undefined ? value : internalValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-white rounded-3xl border border-[#D9CEDF] shadow-[0_8px_30px_rgba(23,19,31,0.04)] px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 transition-all duration-300 focus-within:border-[#1E5BFF] focus-within:ring-4 focus-within:ring-[#1E5BFF]/10 focus-within:shadow-[0_12px_40px_rgba(30,91,255,0.12)] ${className}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <Search className="h-5 w-5 text-[#6E6678] shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (onChange) onChange(e);
            else setInternalValue(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm sm:text-base text-[#17131F] placeholder:text-[#6E6678]/60 focus:outline-none font-sans"
        />
      </div>

      <div className="flex items-center gap-2">
        {shortcut && (
          <span className="hidden sm:inline-flex items-center font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-2.5 py-1 rounded-lg">
            {shortcut}
          </span>
        )}
        {actionText && (
          <button
            type="submit"
            className="font-mono text-xs font-medium text-white bg-[#1E5BFF] hover:bg-[#1546CC] px-4 py-2 rounded-xl transition-colors cursor-pointer select-none active:scale-[0.98]"
          >
            {actionText}
          </button>
        )}
      </div>
    </form>
  );
};
