import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "oumar_admin_session";

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await isValidSession(token);

  const isLoginPage = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApi =
    (pathname.startsWith("/api/portfolio") ||
      pathname.startsWith("/api/partners") ||
      pathname.startsWith("/api/upload")) &&
    req.method !== "GET";

  if (isAdminArea && !authenticated) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && authenticated) {
    const dashboardUrl = new URL("/admin/portfolio", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isProtectedApi && !authenticated) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/portfolio/:path*", "/api/partners/:path*", "/api/upload/:path*"],
};
