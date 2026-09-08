import {
  markLessonComplete,
  submitQuiz,
  submitAssignment,
  getCourseProgress,
} from "../modules/learning/learning.service";
import { checkAndGenerateCertificate } from "../modules/certificates/certificate.service";
import prisma from "../config/prisma";

// Mock Prisma and certificate service
jest.mock("../config/prisma", () => ({
  lesson: { findUnique: jest.fn() },
  lessonProgress: {
    upsert: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  quiz: { findUnique: jest.fn() },
  quizAttempt: { create: jest.fn() },
  assignment: { findUnique: jest.fn() },
  assignmentSubmission: { upsert: jest.fn() },
  course: { findUnique: jest.fn() },
  certificate: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  notification: { create: jest.fn() },
}));

jest.mock("../modules/certificates/certificate.service", () => ({
  checkAndGenerateCertificate: jest.fn().mockResolvedValue(null),
}));

describe("Learning Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkAndGenerateCertificate as jest.Mock).mockResolvedValue(null);
  });

  // ─── markLessonComplete ──────────────────────────────────────────────────────

  describe("markLessonComplete", () => {
    it("marks a plain lesson complete and upserts progress", async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue({
        id: "lesson-1",
        courseId: "course-1",
        quiz: null,
        assignment: null,
      });
      (prisma.lessonProgress.upsert as jest.Mock).mockResolvedValue({
        userId: "user-1",
        lessonId: "lesson-1",
      });

      const result = await markLessonComplete("user-1", "lesson-1");

      expect(result.lessonId).toBe("lesson-1");
      expect(prisma.lessonProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_lessonId: { userId: "user-1", lessonId: "lesson-1" } },
        }),
      );
      expect(checkAndGenerateCertificate).toHaveBeenCalledWith("user-1", "course-1");
    });

    it("throws 404 when lesson does not exist", async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(markLessonComplete("user-1", "bad-lesson")).rejects.toThrow(
        "Lesson not found",
      );
    });

    it("throws 400 when lesson requires quiz completion", async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue({
        id: "lesson-q",
        courseId: "course-1",
        quiz: { id: "quiz-1" },
        assignment: null,
      });

      await expect(markLessonComplete("user-1", "lesson-q")).rejects.toThrow(
        "Cannot mark lesson complete",
      );
    });

    it("throws 400 when lesson requires assignment submission", async () => {
      (prisma.lesson.findUnique as jest.Mock).mockResolvedValue({
        id: "lesson-a",
        courseId: "course-1",
        quiz: null,
        assignment: { id: "assign-1" },
      });

      await expect(markLessonComplete("user-1", "lesson-a")).rejects.toThrow(
        "Cannot mark lesson complete",
      );
    });
  });

  // ─── submitQuiz ───────────────────────────────────────────────────────────────

  describe("submitQuiz", () => {
    const mockQuiz = {
      id: "quiz-1",
      lessonId: "lesson-1",
      lesson: { courseId: "course-1" },
      questions: [
        { correctOptionIndex: 0 },
        { correctOptionIndex: 2 },
        { correctOptionIndex: 1 },
      ],
    };

    it("calculates 100% score and marks lesson complete on all-correct answers", async () => {
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValue(mockQuiz);
      (prisma.quizAttempt.create as jest.Mock).mockResolvedValue({
        id: "attempt-1",
        score: 100,
        passed: true,
      });
      (prisma.lessonProgress.upsert as jest.Mock).mockResolvedValue({});

      const attempt = await submitQuiz("user-1", {
        quizId: "quiz-1",
        answers: [0, 2, 1],
      });

      expect(attempt.score).toBe(100);
      expect(attempt.passed).toBe(true);
      expect(prisma.lessonProgress.upsert).toHaveBeenCalled();
      expect(checkAndGenerateCertificate).toHaveBeenCalledWith("user-1", "course-1");
    });

    it("calculates 0% score and does NOT mark lesson complete on zero-correct answers", async () => {
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValue(mockQuiz);
      (prisma.quizAttempt.create as jest.Mock).mockResolvedValue({
        id: "attempt-2",
        score: 0,
        passed: false,
      });

      const attempt = await submitQuiz("user-1", {
        quizId: "quiz-1",
        answers: [1, 0, 0], // all wrong
      });

      expect(attempt.score).toBe(0);
      expect(attempt.passed).toBe(false);
      expect(prisma.lessonProgress.upsert).not.toHaveBeenCalled();
    });

    it("passes when score is exactly 80%", async () => {
      const twoOfThreeQuiz = {
        ...mockQuiz,
        questions: [
          { correctOptionIndex: 0 },
          { correctOptionIndex: 0 },
          { correctOptionIndex: 0 },
          { correctOptionIndex: 0 },
          { correctOptionIndex: 0 },
        ],
      };
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValue(twoOfThreeQuiz);
      (prisma.quizAttempt.create as jest.Mock).mockResolvedValue({ score: 80, passed: true });
      (prisma.lessonProgress.upsert as jest.Mock).mockResolvedValue({});

      const attempt = await submitQuiz("user-1", {
        quizId: "quiz-1",
        answers: [0, 0, 0, 0, 1], // 4/5 = 80%
      });

      expect(attempt.passed).toBe(true);
    });

    it("throws 400 when answer count does not match question count", async () => {
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValue(mockQuiz);

      await expect(
        submitQuiz("user-1", { quizId: "quiz-1", answers: [0] }),
      ).rejects.toThrow("Invalid number of answers");
    });

    it("throws 404 when quiz does not exist", async () => {
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        submitQuiz("user-1", { quizId: "nonexistent", answers: [] }),
      ).rejects.toThrow("Quiz not found");
    });
  });

  // ─── submitAssignment ────────────────────────────────────────────────────────

  describe("submitAssignment", () => {
    const mockAssignment = {
      id: "assign-1",
      lessonId: "lesson-1",
      lesson: { courseId: "course-1" },
    };

    it("saves submission with text content and marks lesson complete", async () => {
      (prisma.assignment.findUnique as jest.Mock).mockResolvedValue(mockAssignment);
      (prisma.assignmentSubmission.upsert as jest.Mock).mockResolvedValue({
        id: "sub-1",
        content: "My answer",
      });
      (prisma.lessonProgress.upsert as jest.Mock).mockResolvedValue({});

      const submission = await submitAssignment("user-1", {
        assignmentId: "assign-1",
        content: "My answer",
      });

      expect(submission.id).toBe("sub-1");
      expect(prisma.lessonProgress.upsert).toHaveBeenCalled();
      expect(checkAndGenerateCertificate).toHaveBeenCalledWith("user-1", "course-1");
    });

    it("saves submission with file info", async () => {
      (prisma.assignment.findUnique as jest.Mock).mockResolvedValue(mockAssignment);
      (prisma.assignmentSubmission.upsert as jest.Mock).mockResolvedValue({
        id: "sub-2",
        fileUrl: "https://cdn.example.com/file.pdf",
      });
      (prisma.lessonProgress.upsert as jest.Mock).mockResolvedValue({});

      const submission = await submitAssignment(
        "user-1",
        { assignmentId: "assign-1" },
        { fileUrl: "https://cdn.example.com/file.pdf", filePublicId: "public-id-1" },
      );

      expect(submission.fileUrl).toBeDefined();
    });

    it("throws 400 when neither content nor file is provided", async () => {
      (prisma.assignment.findUnique as jest.Mock).mockResolvedValue(mockAssignment);

      await expect(
        submitAssignment("user-1", { assignmentId: "assign-1" }),
      ).rejects.toThrow("Must provide content or a file");
    });

    it("throws 404 when assignment does not exist", async () => {
      (prisma.assignment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        submitAssignment("user-1", { assignmentId: "bad-id", content: "text" }),
      ).rejects.toThrow("Assignment not found");
    });
  });

  // ─── getCourseProgress ────────────────────────────────────────────────────────

  describe("getCourseProgress", () => {
    it("returns 0% when no lessons are completed", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-1",
        lessons: [{ id: "l1" }, { id: "l2" }, { id: "l3" }],
      });
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([]);

      const progress = await getCourseProgress("user-1", "course-1");

      expect(progress.completedLessons).toBe(0);
      expect(progress.totalLessons).toBe(3);
      expect(progress.progressPercentage).toBe(0);
      expect(progress.isCompleted).toBe(false);
    });

    it("returns partial progress correctly", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-1",
        lessons: [{ id: "l1" }, { id: "l2" }, { id: "l3" }, { id: "l4" }],
      });
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([
        { lessonId: "l1" },
        { lessonId: "l2" },
      ]);

      const progress = await getCourseProgress("user-1", "course-1");

      expect(progress.completedLessons).toBe(2);
      expect(progress.totalLessons).toBe(4);
      expect(progress.progressPercentage).toBe(50);
      expect(progress.isCompleted).toBe(false);
    });

    it("returns 100% and triggers certificate generation when all lessons complete", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-1",
        lessons: [{ id: "l1" }, { id: "l2" }],
      });
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([
        { lessonId: "l1" },
        { lessonId: "l2" },
      ]);

      const progress = await getCourseProgress("user-1", "course-1");

      expect(progress.completedLessons).toBe(2);
      expect(progress.totalLessons).toBe(2);
      expect(progress.progressPercentage).toBe(100);
      expect(progress.isCompleted).toBe(true);
      expect(checkAndGenerateCertificate).toHaveBeenCalledWith("user-1", "course-1");
    });

    it("returns zero state when course has no lessons", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: "course-empty",
        lessons: [],
      });

      const progress = await getCourseProgress("user-1", "course-empty");

      expect(progress.totalLessons).toBe(0);
      expect(progress.isCompleted).toBe(false);
      expect(progress.progressPercentage).toBe(0);
    });

    it("throws 404 when course does not exist", async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getCourseProgress("user-1", "bad-course")).rejects.toThrow(
        "Course not found",
      );
    });
  });
});
