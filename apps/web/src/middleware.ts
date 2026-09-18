import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  if (token) {
    const role = request.cookies.get("blih_role")?.value;
    if (role === "ADMIN" && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
