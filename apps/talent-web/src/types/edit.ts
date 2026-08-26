import React from "react";

export interface GeneralDetailsFormProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  fullNameError?: string | null;
  title: string;
  onTitleChange: (val: string) => void;
  titleError?: string | null;
  phone: string;
  onPhoneChange: (val: string) => void;
  phoneError?: string | null;
  country: string;
  onCountryChange: (val: string) => void;
  countryError?: string | null;
  city: string;
  onCityChange: (val: string) => void;
  cityError?: string | null;
  englishLevel: string;
  onEnglishLevelChange: (val: string) => void;
  englishLevelError?: string | null;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  skillsError?: string | null;
  bio: string;
  onBioChange: (val: string) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}
