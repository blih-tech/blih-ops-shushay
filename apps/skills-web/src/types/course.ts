export type CourseStatus = "DRAFT" | "PUBLISHED";

export interface LessonDocument {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface QuizQuestion {
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string | null;
  order: number;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  documents: LessonDocument[];
  quiz: Quiz | null;
  assignment: Assignment | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  status?: CourseStatus;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  _count?: { lessons: number };
}

// Public course detail (no status, restricted lesson data)
export interface PublicLesson {
  id: string;
  title: string;
  order: number;
  videoUrl: string | null;
  documents: Pick<LessonDocument, "id" | "name">[];
  quiz: Pick<Quiz, "id" | "title"> | null;
  assignment: Pick<Assignment, "id" | "title"> | null;
}

export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lessons: PublicLesson[];
}

export interface PublicCourseListItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count: { lessons: number };
}
