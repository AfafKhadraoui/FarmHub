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

  // Protect /workspace/* routes (authenticated users)
  if (pathname.startsWith("/workspace")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users from regular login/register pages to workspace
  if (pathname === "/login" || pathname.startsWith("/register")) {
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
