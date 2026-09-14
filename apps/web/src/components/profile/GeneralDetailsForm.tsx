import React from "react";
import { User, Save, Phone, MapPin, Globe } from "lucide-react";
import {
  FormField,
  Input,
  Select,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@blih/ui";
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
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const englishLevel = watch("englishLevel");
  const skills = watch("skills") || [];
  const bio = watch("bio") || "";

  return (
    <form onSubmit={onSubmit}>
      <Card className="border border-[#D9CEDF] rounded-3xl shadow-[0_4px_20px_rgba(23,19,31,0.03)] overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-sm">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[#17131F] font-display">
                General Profile Details
              </CardTitle>
              <CardDescription className="text-sm text-[#6E6678] font-sans">
                Your professional identity, contact reachability, and capability
                tags.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              required
              error={errors.fullName?.message}
            >
              <Input
                type="text"
                placeholder="e.g. Mikeal Tadesse"
                leftIcon={<User className="h-4 w-4 text-[#6E6678]" />}
                disabled={saving}
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </FormField>

            <FormField
              label="Professional Title"
              required
              error={errors.title?.message}
            >
              <Input
                type="text"
                placeholder="e.g. Senior Frontend Systems Engineer"
                maxLength={100}
                disabled={saving}
                error={errors.title?.message}
                {...register("title")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              label="Phone Number"
              required
              error={errors.phone?.message}
            >
              <Input
                type="tel"
                placeholder="e.g. +251 91 123 4567"
                leftIcon={<Phone className="h-4 w-4 text-[#6E6678]" />}
                maxLength={20}
                disabled={saving}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </FormField>

            <FormField
              label="English Proficiency"
              required
              error={errors.englishLevel?.message}
            >
              <Select
                value={englishLevel || ""}
                onChange={(e) =>
                  setValue("englishLevel", e.target.value as any, {
                    shouldValidate: true,
                  })
                }
                placeholder="Select English level"
                options={ENGLISH_LEVELS}
                disabled={saving}
                error={errors.englishLevel?.message}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Country" required error={errors.country?.message}>
              <Input
                type="text"
                placeholder="e.g. Ethiopia"
                leftIcon={<Globe className="h-4 w-4 text-[#6E6678]" />}
                disabled={saving}
                error={errors.country?.message}
                {...register("country")}
              />
            </FormField>

            <FormField label="City" required error={errors.city?.message}>
              <Input
                type="text"
                placeholder="e.g. Addis Ababa"
                leftIcon={<MapPin className="h-4 w-4 text-[#6E6678]" />}
                disabled={saving}
                error={errors.city?.message}
                {...register("city")}
              />
            </FormField>
          </div>

          <div className="border-t border-[#D9CEDF]/80 my-8 pt-6" />

          <SkillsInput
            value={skills}
            onChange={(newSkills) =>
              setValue("skills", newSkills, { shouldValidate: true })
            }
            disabled={saving}
            error={errors.skills?.message}
          />

          <FormField
            label="About & Technical Overview"
            error={errors.bio?.message}
          >
            <Textarea
              placeholder="Highlight your core engineering expertise, architectural decisions, and career objectives..."
              maxLength={500}
              disabled={saving}
              rows={4}
              error={errors.bio?.message}
              value={bio}
              {...register("bio")}
            />
          </FormField>

          <div className="flex justify-end pt-4 border-t border-[#D9CEDF]/80 mt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
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
