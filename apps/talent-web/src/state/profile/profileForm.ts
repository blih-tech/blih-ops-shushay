import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateTalentProfileSchema,
  UpdateTalentProfileInput,
} from "@/shared/talent.schemas";
import { TalentProfile } from "@/types/profile";
import { useEffect } from "react";

export type ProfileFormReturn = UseFormReturn<UpdateTalentProfileInput>;

export function useProfileFormState(
  profile?: TalentProfile | null,
): ProfileFormReturn {
  const form = useForm<UpdateTalentProfileInput>({
    resolver: zodResolver(updateTalentProfileSchema),
    defaultValues: {
      fullName: "",
      title: "",
      phone: "",
      country: "",
      city: "",
      englishLevel: undefined,
      skills: [],
      bio: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || "",
        title: profile.title || "",
        phone: profile.phone || "",
        country: profile.country || "",
        city: profile.city || "",
        englishLevel: profile.englishLevel || undefined,
        skills: profile.skills || [],
        bio: profile.bio || "",
      });
    }
  }, [profile, form]);

  return form;
}
