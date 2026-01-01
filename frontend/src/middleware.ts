import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Allow /admin/login and /admin/dashboard/* to pass through
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/dashboard")
  ) {
    return NextResponse.next();
  }

  // Protect other /admin/* routes (require token)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect /dashboard, /tasks, /fields, /weather routes (authenticated users)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/fields") ||
    pathname.startsWith("/weather")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Let login/register pages handle their own redirects based on user role
  // (admin -> /admin/dashboard, worker/farmer -> /dashboard)

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/fields/:path*",
    "/weather/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/security/:path*",
    "/workers/:path*",
    "/login",
    "/register",
  ],
};
