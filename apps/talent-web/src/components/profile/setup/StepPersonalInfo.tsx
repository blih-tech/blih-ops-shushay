import React from "react";
import { User, ChevronRight } from "lucide-react";
import { FormField, Input, Button } from "@blih/ui";
import { ProfileFormReturn } from "@/state/profile/profileForm";

interface StepPersonalInfoProps {
  form: ProfileFormReturn;
  saving: boolean;
  onNext: (e: React.FormEvent) => void;
}

export const StepPersonalInfo: React.FC<StepPersonalInfoProps> = ({
  form,
  saving,
  onNext,
}) => {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onNext} className="space-y-5 font-sans">
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
          placeholder="e.g. Fullstack Developer, UI/UX Designer"
          maxLength={100}
          disabled={saving}
          error={errors.title?.message}
          {...register("title")}
        />
      </FormField>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <div className="flex justify-end pt-4 border-t border-border mt-6">
        <Button
          type="submit"
          variant="primary"
          rightIcon={<ChevronRight className="h-4 w-4" />}
          disabled={saving}
        >
          Continue to Skills
        </Button>
      </div>
    </form>
  );
};
export default StepPersonalInfo;
