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
      if (typeof window !== "undefined" && parsed.origin === window.location.origin) {
        return parsed.pathname + parsed.search + parsed.hash || "/";
      }
      const envAppUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (envAppUrl) {
        try {
          const envParsed = new URL(envAppUrl);
          if (parsed.origin === envParsed.origin) {
            return parsed.pathname + parsed.search + parsed.hash || "/";
          }
        } catch {
          // ignore invalid env var
        }
      }
      return url;
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
}

export function getNavLinks({
  role,
  currentPath,
  currentApp,
}: NavLinksConfig): NavLinkItem[] {
  const isMatch = (targetPath: string, exact = false) =>
    isPathMatch(currentPath, targetPath, exact);

  if (role === "TALENT") {
    return [
      {
        label: "Explore",
        href: "/",
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Courses",
        href: "/courses",
        active: currentPath
          ? isMatch("/courses") && !isMatch("/admin")
          : currentApp === "courses",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        active: currentPath
          ? isMatch("/dashboard")
          : currentApp === "dashboard",
      },
      {
        label: "Opportunities",
        href: "/jobs",
        active: currentPath ? isMatch("/jobs") : currentApp === "opportunities",
      },
      {
        label: "My Applications",
        href: "/applications",
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
        href: "/",
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Dashboard",
        href: "/company",
        active: currentPath
          ? isMatch("/company") &&
            !isMatch("/company/jobs") &&
            !isMatch("/company/talents") &&
            !isMatch("/company/subscription")
          : currentApp === "company" || currentApp === "dashboard",
      },
      {
        label: "Job Posts",
        href: "/company/jobs",
        active: currentPath ? isMatch("/company/jobs") : currentApp === "jobs",
      },
      {
        label: "Talent Search",
        href: "/company/talents",
        active: currentPath
          ? isMatch("/company/talents")
          : currentApp === "talents",
      },
      {
        label: "Subscription",
        href: "/company/subscription",
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
        href: "/",
        active: currentPath ? isMatch("/", true) : currentApp === "explore",
      },
      {
        label: "Admin Hub",
        href: "/admin",
        active: currentPath
          ? isMatch("/admin") &&
            !isMatch("/admin/courses") &&
            !isMatch("/admin/talents") &&
            !isMatch("/admin/companies")
          : currentApp === "admin",
      },
      {
        label: "Course Studio",
        href: "/admin/courses",
        active: isMatch("/admin/courses"),
      },
      {
        label: "Talent Directory",
        href: "/admin/talents",
        active: isMatch("/admin/talents"),
      },
      {
        label: "Companies",
        href: "/admin/companies",
        active: isMatch("/admin/companies"),
      },
    ];
  }

  // Unauthenticated guest navigation — no nav links before login
  return [];
}
