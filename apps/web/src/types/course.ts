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
  content?: string | null;
  videoUrl: string | null;
  documents: Pick<LessonDocument, "id" | "name">[];
  quiz: (Pick<Quiz, "id" | "title"> & { questions: QuizQuestion[] }) | null;
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

export type StepType = "video" | "reading" | "quiz" | "exercise";

export interface CourseStep {
  id: string;
  lessonId: string;
  lessonIndex: number;
  lessonTitle: string;
  type: StepType;
  title: string;
  lesson: PublicLesson;
}

export function buildCourseSteps(lessons: PublicLesson[]): CourseStep[] {
  const steps: CourseStep[] = [];

  lessons.forEach((lesson, lessonIndex) => {
    let lessonHasSteps = false;

    if (lesson.videoUrl) {
      steps.push({
        id: `${lesson.id}-video`,
        lessonId: lesson.id,
        lessonIndex,
        lessonTitle: lesson.title,
        type: "video",
        title: lesson.title,
        lesson,
      });
      lessonHasSteps = true;
    }

    if (lesson.content) {
      steps.push({
        id: `${lesson.id}-reading`,
        lessonId: lesson.id,
        lessonIndex,
        lessonTitle: lesson.title,
        type: "reading",
        title: `Reading: ${lesson.title}`,
        lesson,
      });
      lessonHasSteps = true;
    }

    if (lesson.quiz) {
      steps.push({
        id: `${lesson.id}-quiz`,
        lessonId: lesson.id,
        lessonIndex,
        lessonTitle: lesson.title,
        type: "quiz",
        title: lesson.quiz.title || `Quiz: ${lesson.title}`,
        lesson,
      });
      lessonHasSteps = true;
    }

    if (lesson.assignment) {
      steps.push({
        id: `${lesson.id}-exercise`,
        lessonId: lesson.id,
        lessonIndex,
        lessonTitle: lesson.title,
        type: "exercise",
        title: lesson.assignment.title || `Practical Task: ${lesson.title}`,
        lesson,
      });
      lessonHasSteps = true;
    }

    if (!lessonHasSteps) {
      steps.push({
        id: `${lesson.id}-reading`,
        lessonId: lesson.id,
        lessonIndex,
        lessonTitle: lesson.title,
        type: "reading",
        title: lesson.title,
        lesson,
      });
    }
  });

  return steps;
}
