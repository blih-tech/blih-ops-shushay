export interface CandidateSkill {
  name: string;
  score: number;
  /** "Verified" | "Developing" | any other status string */
  status: string;
  width: string;
  // color is intentionally omitted — components derive it from `status`
}

export interface ExploreCandidate {
  id: string;
  name: string;
  role: string;
  availability: string;
  avatarInitials: string;
  skills: CandidateSkill[];
  evidence: string[];
}

export interface SkillNode {
  id: string;
  label: string;
  status: "Verified" | "Developing" | "Recommended" | "Unverified";
  x: number;
  y: number;
  width: number;
  height: number;
  borderColor: string;
  bgColor: string;
  textColor: string;
  detail: string;
}

export interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchScore: string;
  skills: string[];
}

export interface MetricItem {
  value: string;
  label: string;
  detail: string;
}
