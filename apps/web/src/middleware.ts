import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  if (token) {
    try {
      // JWT format: header.payload.signature
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(payloadJson);
        
        // If the user is an ADMIN and they are trying to access the root page, redirect to /admin
        if (payload.role === "ADMIN" && request.nextUrl.pathname === "/") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    } catch (e) {
      // Ignore decoding errors, just let the request through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
