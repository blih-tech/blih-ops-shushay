export type EnglishLevel =
  | "BASIC"
  | "CONVERSATIONAL"
  | "PROFESSIONAL"
  | "FLUENT"
  | "NATIVE";

export interface Experience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field?: string | null;
  startYear: number;
  endYear?: number | null;
}

export interface TalentProfile {
  id: string;
  userId: string;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  englishLevel?: EnglishLevel | null;
  skills: string[];
  bio?: string | null;
  photoUrl?: string | null;
  cvUrl?: string | null;
  isComplete: boolean;
  experience?: Experience[];
  education?: Education[];
  certificates?: any[];
  completedCourses?: any[];
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName?: string | null;
  description?: string | null;
  website?: string | null;
  country?: string | null;
  city?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  logoUrl?: string | null;
}
