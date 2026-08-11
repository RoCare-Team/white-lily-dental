import { NextResponse } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/**
 * Gate for /admin. Runs on the Edge runtime, so it only verifies the signed
 * cookie — the route handlers re-check the session before touching the DB.
 */
export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const session = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
