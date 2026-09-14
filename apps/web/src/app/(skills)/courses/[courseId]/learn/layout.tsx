import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}

// The learn page manages its own full-screen layout with header + sidebar.
// This layout is intentionally transparent — it just passes children through.
export default function CourseLearningLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
