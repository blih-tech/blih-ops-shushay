import { describe, it, expect } from "vitest";
import { middleware } from "../middleware";
import { NextRequest } from "next/server";

describe("Next.js Middleware Route Protection", () => {
  it("redirects unauthenticated users trying to access /admin to /login", () => {
    const request = new NextRequest("http://localhost:3000/admin/users");
    const response = middleware(request);

    expect(response.status).toBe(307); // NextResponse.redirect
    const location = response.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("redirect=%2Fadmin%2Fusers");
  });

  it("redirects non-admin users trying to access /admin to /", () => {
    const request = new NextRequest("http://localhost:3000/admin/users", {
      headers: {
        cookie: "token=valid-jwt-token; blih_role=TALENT",
      },
    });
    const response = middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toBe("http://localhost:3000/");
  });

  it("allows admin users with valid role and token to access /admin", () => {
    const request = new NextRequest("http://localhost:3000/admin/users", {
      headers: {
        cookie: "token=valid-jwt-token; blih_role=ADMIN",
      },
    });
    const response = middleware(request);

    expect(response.status).toBe(200); // NextResponse.next()
  });

  it("allows unauthenticated users to access public routes like /courses", () => {
    const request = new NextRequest("http://localhost:3000/courses");
    const response = middleware(request);

    expect(response.status).toBe(200);
  });
});
