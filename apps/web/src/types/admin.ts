// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface AdminStats {
  // Core counts
  totalUsers: number;
  totalTalents: number;
  totalCompanies: number;
  totalCourses: number;
  publishedCourses: number;
  totalLessons: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalCertificates: number;
  activeSubscriptions: number;
  totalPayments: number;
  totalRevenue: number;
  totalEntitlements: number;
  // 7-day deltas
  recentUsersCount: number;
  recentJobsCount: number;
  recentApplicationsCount: number;
  // Recent activity
  recentUsers: AdminRecentUser[];
  recentJobs: AdminRecentJob[];
}

export interface AdminRecentUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  talentProfile: { fullName: string | null } | null;
  companyProfile: { companyName: string | null } | null;
}

export interface AdminRecentJob {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  companyProfile: { companyName: string | null };
  _count: { applications: number };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  talentProfile: {
    id: string;
    fullName: string | null;
    title: string | null;
    photoUrl: string | null;
    skills: string[];
    country: string | null;
    city: string | null;
  } | null;
  companyProfile: {
    id: string;
    companyName: string | null;
    logoUrl: string | null;
    country: string | null;
    city: string | null;
    subscriptionActive: boolean;
    subscriptionExpiresAt: string | null;
  } | null;
  skillsEntitlement: {
    id: string;
    grantedAt: string;
  } | null;
  _count: {
    paymentTransactions: number;
    certificates: number;
  };
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Talents ──────────────────────────────────────────────────────────────────

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
    emailVerified: boolean;
    createdAt: string;
    skillsEntitlement: { id: string; grantedAt: string } | null;
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
  _count: { jobApplications: number };
}

export interface AdminTalentListResponse {
  talents: AdminTalentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Companies ────────────────────────────────────────────────────────────────

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
  subscriptionActive: boolean;
  subscriptionExpiresAt: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
  };
  companySubscription: {
    id: string;
    plan: string;
    status: string;
    amount: number;
    currency: string;
    startDate: string;
    expiresAt: string;
  } | null;
  _count: { jobs: number };
}

export interface AdminCompanyListResponse {
  companies: AdminCompanyItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface AdminJob {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  englishLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryDisplay: string | null;
  employmentType: string;
  workingHours: string | null;
  timezone: string | null;
  countryRestrictions: string[];
  experienceLevel: string;
  applicationDeadline: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  companyProfile: {
    id: string;
    companyName: string | null;
    logoUrl: string | null;
    country: string | null;
    city: string | null;
  };
  _count: { applications: number };
}

export interface AdminJobListResponse {
  jobs: AdminJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminJobDetail extends AdminJob {
  companyProfile: AdminJob["companyProfile"] & {
    user: { email: string };
    companySubscription: { status: string; expiresAt: string; plan: string } | null;
  };
  applications: {
    id: string;
    status: string;
    coverLetter: string | null;
    createdAt: string;
    talentProfile: {
      fullName: string | null;
      title: string | null;
      photoUrl: string | null;
      user: { email: string };
    };
  }[];
}

// ─── Applications ─────────────────────────────────────────────────────────────

export interface AdminApplication {
  id: string;
  status: string;
  coverLetter: string | null;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    status: string;
    employmentType: string;
    companyProfile: {
      companyName: string | null;
      logoUrl: string | null;
    };
  };
  talentProfile: {
    fullName: string | null;
    title: string | null;
    photoUrl: string | null;
    user: { email: string };
  };
}

export interface AdminApplicationListResponse {
  applications: AdminApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface AdminPayment {
  id: string;
  txRef: string;
  amount: number;
  currency: string;
  paymentType: string;
  status: string;
  chapaRef: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    talentProfile: { fullName: string | null } | null;
    companyProfile: { companyName: string | null } | null;
  };
}

export interface AdminPaymentListResponse {
  payments: AdminPayment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: {
    totalRevenue: number;
    successfulCount: number;
  };
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export interface AdminSubscription {
  id: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  startDate: string;
  expiresAt: string;
  createdAt: string;
  companyProfile: {
    id: string;
    companyName: string | null;
    logoUrl: string | null;
    country: string | null;
    user: { email: string };
  };
  payment: {
    txRef: string;
    amount: number;
    currency: string;
    status: string;
  } | null;
}

export interface AdminSubscriptionListResponse {
  subscriptions: AdminSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export interface AdminCertificate {
  id: string;
  certificateNumber: string;
  issueDate: string;
  pdfUrl: string | null;
  createdAt: string;
  user: {
    email: string;
    talentProfile: { fullName: string | null; photoUrl: string | null } | null;
  };
  course: {
    id: string;
    title: string;
  };
}

export interface AdminCertificateListResponse {
  certificates: AdminCertificate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  user: {
    email: string;
    role: string;
    talentProfile: { fullName: string | null } | null;
    companyProfile: { companyName: string | null } | null;
  };
}

export interface AdminNotificationListResponse {
  notifications: AdminNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Pagination helper ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
