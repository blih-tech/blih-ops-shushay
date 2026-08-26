import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input, Button } from "@/components/ui";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ value, onChange, error, disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (!cleaned || disabled) return;
    if (!value.some(s => s.toLowerCase() === cleaned.toLowerCase())) {
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
    onChange(value.filter(s => s !== skillToRemove));
  };

  return (
    <div className="space-y-2 font-sans">
      <label className="block text-xs font-semibold text-foreground uppercase tracking-widest">
        Skills / Technologies
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React, Node.js — press Enter to add"
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
        <div className="flex flex-wrap gap-2 pt-3">
          {value.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemove(skill)}
                className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors focus:outline-none"
                aria-label={`Remove ${skill}`}
                disabled={disabled}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic pt-1">
          No skills added yet. Add at least one skill to activate your profile.
        </p>
      )}
    </div>
  );
};
export default SkillsInput;
