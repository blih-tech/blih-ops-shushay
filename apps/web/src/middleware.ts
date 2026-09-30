import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("blih_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const returnTo = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, request.url));
    }
  }

  if (token) {
    if (role === "ADMIN" && pathname === "/") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};

