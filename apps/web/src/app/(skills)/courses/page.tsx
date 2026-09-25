"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Layers, ArrowRight } from "lucide-react";
import { Button, Alert, EmptyState, UniversalSearch, Chip } from "@blih/ui";
import { fetchPublicCourses } from "@/lib/courses";
import type { PublicCourseListItem } from "@/types/course";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseCardSkeleton } from "@/components/courses/CourseCardSkeleton";
import { useAuth } from "@/providers/AuthProvider";
import { getUserEnrollments } from "@blih/api-client";

export default function CourseCatalogPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<PublicCourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Mobile",
    "Data Science",
    "DevOps",
    "UI/UX",
    "Cybersecurity",
  ];

  useEffect(() => {
    fetchPublicCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  // Load enrollments when user is logged in
  useEffect(() => {
    if (!user) return;
    getUserEnrollments()
      .then((enrollments) => {
        setEnrolledCourseIds(new Set(enrollments.map((e) => e.courseId)));
      })
      .catch(() => {
        // Non-fatal: enrollments are UI-only decorators here
      });
  }, [user]);

  const filteredCourses = courses.filter((course, index, self) => {
    // Deduplicate by course ID or title
    const isFirstOccurrence =
      self.findIndex(
        (c) =>
          c.id === course.id ||
          c.title.toLowerCase() === course.title.toLowerCase(),
      ) === index;

    if (!isFirstOccurrence) return false;

    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      course.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
      course.description.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title & Premise */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#17131F] bg-white border border-[#D9CEDF] shadow-2xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#17131F]" />
          <span>Learning Discovery</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F]">
          Course Catalog
        </h1>
        <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
          Practical, expert-led courses with hands-on projects and verified
          digital credentials to strengthen your Skill Profile.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <UniversalSearch
          placeholder="Search courses, skills, or capabilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={(q) => setSearchQuery(q)}
          actionText="Search"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => (
            <Chip
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              size="md"
            >
              {cat}
            </Chip>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <CourseCardSkeleton key={i} themeIndex={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8 text-[#17131F]" />}
          title="No courses matched your query"
          description="Try changing your search terms or explore all available tracks."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      )}

      {/* Course Grid */}
      {!loading && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={enrolledCourseIds.has(course.id)}
            />
          ))}
        </div>
      )}

      {/* Career Pathways Banner */}
      <div className="bg-white border border-[#D9CEDF] rounded-xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold text-[#17131F]">
            Looking to fast-track your remote career?
          </h3>
          <p className="font-sans text-sm sm:text-base text-[#6E6678]">
            Combine multiple courses into a verified specialization track and
            stand out to hiring companies.
          </p>
        </div>
        <Link href="/dashboard">
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Recommended Path
          </Button>
        </Link>
      </div>
    </main>
  );
}
