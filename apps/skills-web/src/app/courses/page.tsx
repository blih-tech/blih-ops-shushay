"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Skeleton,
  Alert,
  EmptyState,
  UniversalSearch,
  Chip,
  GlobalNavbar,
} from "@blih/ui";
import { fetchPublicCourses } from "@/lib/courses";
import type { PublicCourseListItem } from "@/types/course";
import { useAuth } from "@/providers/AuthProvider";

function CourseCardSkeleton() {
  return (
    <Card className="flex flex-col bg-white border border-[#D9CEDF] rounded-3xl p-6">
      <CardHeader className="p-0 pb-4">
        <Skeleton variant="rectangular" height={24} className="w-3/4 mb-3 rounded-xl" />
        <Skeleton variant="text" className="w-full mb-1" />
        <Skeleton variant="text" className="w-5/6" />
      </CardHeader>
      <CardContent className="p-0 flex-1" />
      <div className="pt-4 border-t border-[#D9CEDF]/50">
        <Skeleton variant="rectangular" height={44} className="w-full rounded-2xl" />
      </div>
    </Card>
  );
}

function CourseCard({ course }: { course: PublicCourseListItem }) {
  const lessonCount = course._count?.lessons || 0;
  return (
    <Card
      variant="interactive"
      className="flex flex-col justify-between group h-full"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/15 flex items-center justify-center text-[#1E5BFF] group-hover:bg-[#1E5BFF] group-hover:text-white transition-all duration-300 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <Badge variant="primary" size="sm">
            {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
          </Badge>
        </div>

        <CardTitle className="text-xl font-bold mb-2 group-hover:text-[#1E5BFF] transition-colors leading-snug">
          {course.title}
        </CardTitle>

        <CardDescription className="line-clamp-3 text-sm text-[#6E6678] mb-4">
          {course.description}
        </CardDescription>

        <div className="flex flex-wrap gap-1.5 mb-6">
          <Badge variant="secondary" size="sm">
            Assessment Included
          </Badge>
          <Badge variant="verified" size="sm">
            Verified Credential
          </Badge>
        </div>
      </div>

      <div className="pt-4 border-t border-[#D9CEDF]/50 mt-auto">
        <Link href={`/courses/${course.id}`} className="w-full block">
          <Button
            variant="outline"
            fullWidth
            rightIcon={<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          >
            Explore Curriculum
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function CourseCatalogPage() {
  const { user, logout } = useAuth();
  const TALENT_URL = process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002";
  const [courses, setCourses] = useState<PublicCourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Frontend Systems", "TypeScript", "UI & Design", "Backend", "Career Path"];

  useEffect(() => {
    fetchPublicCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Background ambient gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        currentApp="skills"
        user={user ? { email: user.email, role: user.role } : null}
        onSignOut={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Page Title & Premise */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#1E5BFF] bg-[#DDE7FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Learning Discovery</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17131F]">
            Course Catalog
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
            Practical, expert-led courses with hands-on projects and verified digital credentials to strengthen your Skill Profile.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <UniversalSearch
            placeholder="Search courses, skills, or capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={(q) => setSearchQuery(q)}
            actionText="Filter"
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
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <EmptyState
            icon={<GraduationCap className="w-8 h-8 text-[#1E5BFF]" />}
            title="No courses matched your query"
            description="Try changing your search terms or explore all available tracks."
            action={
              <Button variant="secondary" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>
                Clear Filters
              </Button>
            }
          />
        )}

        {/* Course Grid */}
        {!loading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* Career Pathways Banner */}
        <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-[#17131F]">
              Looking to fast-track your remote career?
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#6E6678]">
              Combine multiple courses into a verified specialization track and stand out to hiring companies.
            </p>
          </div>
          <Link href="/dashboard">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Recommended Path
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#D9CEDF]/60 flex flex-col sm:flex-row justify-between items-center text-[#6E6678] text-xs font-mono gap-4 mt-12">
        <p>© 2026 Blih Skills & Talent Ecosystem. All rights reserved.</p>
        <div className="flex gap-4 uppercase tracking-wider">
          <Link href="/dashboard" className="hover:text-[#1E5BFF] transition-colors">
            Dashboard
          </Link>
          <span className="text-[#D9CEDF]">·</span>
          <a href={`${TALENT_URL}/jobs`} className="hover:text-[#1E5BFF] transition-colors">
            Opportunities
          </a>
        </div>
      </footer>
    </div>
  );
}
