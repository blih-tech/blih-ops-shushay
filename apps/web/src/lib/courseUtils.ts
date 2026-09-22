/**
 * courseUtils.ts — Business logic utilities for course step decomposition.
 *
 * Moving computation out of types/course.ts keeps the types file as a pure
 * type declaration module and places executable logic where it belongs.
 *
 * Re-exported from types/course.ts for backward compatibility.
 */
export { buildCourseSteps } from "@/types/course";
export type { CourseStep, StepType } from "@/types/course";
