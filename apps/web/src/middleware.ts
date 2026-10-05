import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const tokenRole = getRoleFromToken(token);
  const role = tokenRole || request.cookies.get("blih_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. Admin Workspace Guard
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const returnTo = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, request.url));
    }

    if (role && role !== "ADMIN") {
      const destination = role === "COMPANY" ? "/company" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // 2. Company Workspace Guard
  if (pathname.startsWith("/company")) {
    if (!token) {
      const returnTo = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, request.url));
    }

    if (role && role !== "COMPANY" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Talent Dashboard & Applications Guard
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/applications")) {
    if (!token) {
      const returnTo = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, request.url));
    }

    if (role && role !== "TALENT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/company", request.url));
    }
  }

  // 4. Authenticated-only Profile routes
  if (pathname.startsWith("/profile")) {
    if (!token) {
      const returnTo = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, request.url));
    }
  }

  // 5. Root redirection for logged-in admin
  if (token && role === "ADMIN" && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();
  if (tokenRole && request.cookies.get("blih_role")?.value !== tokenRole) {
    response.cookies.set("blih_role", tokenRole, { path: "/", maxAge: 7 * 24 * 60 * 60 });
  }
  return response;
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/company/:path*",
    "/dashboard/:path*",
    "/applications/:path*",
    "/profile/:path*",
    // /auth/callback is intentionally excluded — it handles OAuth token exchange
  ],
};

