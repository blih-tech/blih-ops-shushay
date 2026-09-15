export interface TalentProfile {
  id: string;
  fullName: string | null;
  title: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  englishLevel: string | null;
  skills: string[];
  photoUrl: string | null;
  cvUrl: string | null;
  experience?: any[];
  education?: any[];
  profileCompletion: {
    percentage: number;
    missingFields: string[];
    isComplete: boolean;
  };
}
