export interface NavLinkItem {
  label: string;
  href: string;
  active?: boolean;
}

export function toRelativeUrl(url: string): string {
  if (!url) return "/";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search + parsed.hash || "/";
    } catch {
      return url;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
}

export function isPathMatch(
  currentPath: string,
  targetPath: string,
  exact = false,
): boolean {
  if (!currentPath) return false;
  if (exact || targetPath === "/") {
    return currentPath === targetPath;
  }
  return currentPath.startsWith(targetPath);
}

interface NavLinksConfig {
  role?: string;
  currentPath: string;
  currentApp?: string;
  skillsUrl: string;
  talentUrl: string;
}

export function getNavLinks({
  role,
  currentPath,
  currentApp,
  skillsUrl,
  talentUrl,
}: NavLinksConfig): NavLinkItem[] {
  const isMatch = (targetPath: string, exact = false) =>
    isPathMatch(currentPath, targetPath, exact);

  if (role === "TALENT") {
    return [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Courses",
        href: `${skillsUrl}/courses`,
        active: currentPath
          ? isMatch("/courses") && !isMatch("/admin")
          : currentApp === "courses",
      },
      {
        label: "Dashboard",
        href: `${skillsUrl}/dashboard`,
        active: currentPath
          ? isMatch("/dashboard")
          : currentApp === "dashboard",
      },
      {
        label: "Opportunities",
        href: `${talentUrl}/jobs`,
        active: currentPath ? isMatch("/jobs") : currentApp === "opportunities",
      },
      {
        label: "My Applications",
        href: `${talentUrl}/applications`,
        active: currentPath
          ? isMatch("/applications")
          : currentApp === "applications",
      },
    ];
  }

  if (role === "COMPANY") {
    return [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Hiring Hub",
        href: `${talentUrl}/company`,
        active: currentPath
          ? isMatch("/company") &&
            !isMatch("/company/jobs") &&
            !isMatch("/company/talents") &&
            !isMatch("/company/subscription")
          : currentApp === "company" || currentApp === "business",
      },
      {
        label: "Job Posts",
        href: `${talentUrl}/company/jobs`,
        active: currentPath ? isMatch("/company/jobs") : currentApp === "jobs",
      },
      {
        label: "Talent Search",
        href: `${talentUrl}/company/talents`,
        active: currentPath
          ? isMatch("/company/talents")
          : currentApp === "talents",
      },
      {
        label: "Subscription",
        href: `${talentUrl}/company/subscription`,
        active: currentPath
          ? isMatch("/company/subscription")
          : currentApp === "subscription",
      },
    ];
  }

  if (role === "ADMIN") {
    return [
      {
        label: "Explore",
        href: `${talentUrl}/`,
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Admin Hub",
        href: `${skillsUrl}/admin`,
        active: currentPath
          ? isMatch("/admin") &&
            !isMatch("/admin/courses") &&
            !isMatch("/admin/talents") &&
            !isMatch("/admin/companies")
          : currentApp === "admin",
      },
      {
        label: "Course Studio",
        href: `${skillsUrl}/admin/courses`,
        active: isMatch("/admin/courses"),
      },
      {
        label: "Talent Directory",
        href: `${skillsUrl}/admin/talents`,
        active: isMatch("/admin/talents"),
      },
      {
        label: "Companies",
        href: `${skillsUrl}/admin/companies`,
        active: isMatch("/admin/companies"),
      },
    ];
  }

  // Unauthenticated guest navigation — no nav links before login
  return [];
}
