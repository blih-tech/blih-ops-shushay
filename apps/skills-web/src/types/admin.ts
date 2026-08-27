export interface AdminStats {
  totalTalents: number;
  totalCompanies: number;
  totalCourses: number;
  publishedCourses: number;
  totalLessons: number;
}

export interface AdminTalentItem {
  id: string;
  userId: string;
  fullName: string | null;
  title: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  englishLevel: string | null;
  skills: string[];
  bio: string | null;
  photoUrl: string | null;
  cvUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  experience: {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string | null;
    startYear: number;
    endYear: number | null;
  }[];
}

export interface AdminCompanyItem {
  id: string;
  userId: string;
  companyName: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}
