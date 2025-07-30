import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("titans_access_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isSignUpPage = request.nextUrl.pathname === "/sign-up";
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/sign-up" ||
    request.nextUrl.pathname === "/verify-otp";

  // If user is not authenticated and trying to access protected route
  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access login page
  if (accessToken && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to sign-up page for both authenticated and unauthenticated users
  if (isSignUpPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
