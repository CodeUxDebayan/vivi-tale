import { NextResponse } from "next/server";

export function proxy(request) {
  const url = request.nextUrl.pathname;

  if (url.startsWith("/admin")) {
    const authCookie = request.cookies.get("adminAuth");
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (authCookie?.value !== validPassword) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
