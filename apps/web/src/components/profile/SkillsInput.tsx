import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input, Button } from "@blih/ui";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (!cleaned || disabled) return;
    if (!value.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      onChange([...value, cleaned]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  const handleRemove = (skillToRemove: string) => {
    if (disabled) return;
    onChange(value.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-2.5 font-sans">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#6E6678]">
        Skills & Technical Stack
      </label>
      <div className="flex gap-2.5 items-center">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Next.js, TypeScript, GraphQL — press Enter to add"
          error={error}
          disabled={disabled}
          fullWidth
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => addSkill(inputValue)}
          leftIcon={<Plus className="h-4 w-4" />}
          className="shrink-0"
          disabled={disabled || !inputValue.trim()}
        >
          Add
        </Button>
      </div>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-2">
          {value.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EEF3FF] border border-[#1E5BFF]/25 text-[#1E5BFF] text-xs font-mono font-medium shadow-xs"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemove(skill)}
                className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-[#1E5BFF]/20 transition-colors focus:outline-none cursor-pointer"
                aria-label={`Remove ${skill}`}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#6E6678] font-sans italic pt-1">
          No skills added yet. Type a technology and click &quot;Add&quot;.
        </p>
      )}
    </div>
  );
};
export default SkillsInput;
