import React from "react";

export interface StepPersonalInfoProps {
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
  saving: boolean;
  onNext: (e: React.FormEvent) => void;
}

export interface EnglishLevelOption {
  value: string;
  label: string;
  description: string;
}

export interface StepExpertiseProps {
  englishLevel: string;
  onEnglishLevelChange: (val: string) => void;
  englishLevelError?: string | null;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  skillsError?: string | null;
  bio: string;
  setBio: (val: string) => void;
  saving: boolean;
  onBack: () => void;
  onNext: (e: React.FormEvent) => void;
}

export interface StepMediaProps {
  photoUrl?: string | null;
  onPhotoUpload: (file: File) => Promise<void>;
  onPhotoDelete: () => Promise<void>;
  cvUrl?: string | null;
  onCvUpload: (file: File) => Promise<void>;
  onCvDelete: () => Promise<void>;
  saving: boolean;
  onBack: () => void;
  onComplete: () => void;
}
