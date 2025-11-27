import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Protect /admin/* routes (admin only), but allow /admin/login and /admin/dashboard
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/dashboard") &&
    !pathname.startsWith("/admin/login")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // TODO: verify token and role
  }

  // Protect /workspace/* routes (authenticated users)
  if (pathname.startsWith("/workspace")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users from auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      return NextResponse.redirect(
        new URL("/workspace/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/admin/:path*", "/login", "/register"],
};
