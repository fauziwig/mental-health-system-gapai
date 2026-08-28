import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session")?.value;

  const isAuthenticated = Boolean(adminSession);

  // 1. Jika mengakses halaman root ('/')
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 2. Jika mengakses halaman login ('/admin/login') dan sudah login sebelumnya
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 3. Jika mengakses rute admin lainnya ('/admin', '/admin/sessions', etc) dan belum login
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - health (Health diagnostic page)
     * - assessment (Candidate assessment flow)
     * - assets (Static assets)
     * - images (Static images)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/",
    "/admin/:path*",
  ],
};
