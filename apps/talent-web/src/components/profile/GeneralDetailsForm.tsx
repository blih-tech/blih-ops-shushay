import React from "react";
import { User, Save } from "lucide-react";
import { FormField, Input, Select, Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from "@/components/ui";
import { SkillsInput } from "./SkillsInput";
import { ProfileFormReturn } from "@/state/profile/profileForm";

const ENGLISH_LEVELS = [
  { value: "BASIC", label: "Basic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
];

interface GeneralDetailsFormProps {
  form: ProfileFormReturn;
  saving: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const GeneralDetailsForm: React.FC<GeneralDetailsFormProps> = ({
  form,
  saving,
  onSubmit,
}) => {
  const { register, watch, setValue, formState: { errors } } = form;

  const englishLevel = watch("englishLevel");
  const skills = watch("skills") || [];

  return (
    <form onSubmit={onSubmit}>
      <Card className="border border-border shadow-none rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/40 border-b border-border p-6 sm:p-8">
          <CardTitle className="text-base font-semibold text-foreground font-sans">
            General Profile Details
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Your name, location, and technical skill descriptors.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6 bg-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Full Name" required error={errors.fullName?.message}>
              <Input
                type="text"
                placeholder="e.g. Abreham Yohannes"
                leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                disabled={saving}
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </FormField>

            <FormField label="Professional Title" required error={errors.title?.message}>
              <Input
                type="text"
                placeholder="e.g. Fullstack Developer"
                maxLength={100}
                disabled={saving}
                error={errors.title?.message}
                {...register("title")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Phone Number" required error={errors.phone?.message}>
              <Input
                type="tel"
                placeholder="e.g. +251943668796"
                maxLength={15}
                disabled={saving}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Country" required error={errors.country?.message}>
              <Input
                type="text"
                placeholder="e.g. Ethiopia"
                disabled={saving}
                error={errors.country?.message}
                {...register("country")}
              />
            </FormField>

            <FormField label="City" required error={errors.city?.message}>
              <Input
                type="text"
                placeholder="e.g. Addis Ababa"
                disabled={saving}
                error={errors.city?.message}
                {...register("city")}
              />
            </FormField>
          </div>

          <div className="border-t border-border my-8 pt-8" />

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

          <FormField label="About Me (Bio)" error={errors.bio?.message}>
            <Textarea
              placeholder="Give a summary of your professional background, remote capabilities, goals, etc."
              maxLength={500}
              disabled={saving}
              rows={4}
              error={errors.bio?.message}
              {...register("bio")}
            />
          </FormField>

          <div className="flex justify-end pt-4 border-t border-border mt-8">
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Profile Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
export default GeneralDetailsForm;
