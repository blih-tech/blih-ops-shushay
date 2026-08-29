import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { FormField, Select, Textarea, Button } from "@blih/ui";
import { SkillsInput } from "../SkillsInput";
import { ProfileFormReturn } from "@/state/profile/profileForm";

const ENGLISH_LEVELS = [
  { value: "BASIC", label: "Basic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
];

interface StepExpertiseProps {
  form: ProfileFormReturn;
  saving: boolean;
  onBack: () => void;
  onNext: (e: React.FormEvent) => void;
}

export const StepExpertise: React.FC<StepExpertiseProps> = ({
  form,
  saving,
  onBack,
  onNext,
}) => {
  const { register, watch, setValue, formState: { errors } } = form;

  const englishLevel = watch("englishLevel");
  const skills = watch("skills") || [];
  const bio = watch("bio") || "";

  return (
    <form onSubmit={onNext} className="space-y-6 font-sans">
      <FormField label="English Level" required error={errors.englishLevel?.message}>
        <Select
          value={englishLevel || ""}
          onChange={(e) => setValue("englishLevel", e.target.value as any, { shouldValidate: true })}
          placeholder="Select proficiency level"
          options={ENGLISH_LEVELS}
          disabled={saving}
          error={errors.englishLevel?.message}
        />
      </FormField>

      <SkillsInput
        value={skills}
        onChange={(newSkills) => setValue("skills", newSkills, { shouldValidate: true })}
        disabled={saving}
        error={errors.skills?.message}
      />

      <div className="border-t border-border my-6 pt-6" />

      <FormField label="About Me (Bio)" error={errors.bio?.message}>
        <Textarea
          placeholder="Give a summary of your professional background, remote capabilities, goals, etc."
          maxLength={500}
          disabled={saving}
          rows={4}
          error={errors.bio?.message}
          value={bio}
          {...register("bio")}
        />
      </FormField>

      <div className="flex justify-between pt-4 border-t border-border mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          disabled={saving}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          rightIcon={<ChevronRight className="h-4 w-4" />}
          disabled={saving}
        >
          Save & Continue
        </Button>
      </div>
    </form>
  );
};
export default StepExpertise;
