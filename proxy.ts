import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic session check only (cookie presence). Real enforcement lives in
 * the (portal) layout, which validates the session against the database.
 */
export function proxy(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  const { pathname } = request.nextUrl;
  const isPortal = pathname.startsWith("/portal");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isPortal && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && sessionCookie && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/login", "/register"],
};
