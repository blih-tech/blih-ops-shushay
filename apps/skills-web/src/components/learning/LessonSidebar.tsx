"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourseProgress } from "@blih/api-client";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  HelpCircle,
  PenTool,
} from "lucide-react";

// Mock types. Ensure proper types are available in your project.
type Lesson = {
  id: string;
  title: string;
  order: number;
  type: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT";
};

export function LessonSidebar({ courseId }: { courseId: string }) {
  const searchParams = useSearchParams();
  const currentLessonId = searchParams.get("lessonId");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, you would fetch the course details and lessons
    // For now, we fetch progress and mock lessons.
    const fetchProgress = async () => {
      try {
        const res = await getCourseProgress(courseId);
        setProgress(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProgress();

    // Mocking lesson fetch for structure
    setLessons([
      { id: "1", title: "Introduction", order: 1, type: "VIDEO" },
      { id: "2", title: "Core Concepts", order: 2, type: "TEXT" },
      { id: "3", title: "Knowledge Check", order: 3, type: "QUIZ" },
      { id: "4", title: "Final Project", order: 4, type: "ASSIGNMENT" },
    ]);
  }, [courseId]);

  const getIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-4 h-4" />;
      case "TEXT":
        return <FileText className="w-4 h-4" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4" />;
      case "ASSIGNMENT":
        return <PenTool className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold mb-4">Course Content</h2>
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y">
          {lessons.map((lesson) => {
            const isActive = currentLessonId === lesson.id;
            const isCompleted = false; // Mock completed state

            return (
              <li key={lesson.id}>
                <Link
                  href={`/courses/${courseId}/learn?lessonId=${lesson.id}`}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-primary/5 border-r-4 border-primary" : ""
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-gray-900"}`}
                    >
                      {lesson.order}. {lesson.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      {getIcon(lesson.type)}
                      <span>{lesson.type}</span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
