import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { homeForRole } from "@/lib/routes";
import type { UserRole } from "@/types/roles";

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = getSecret();

  if (!secret) {
    return NextResponse.next();
  }

  if (!token) {
    if (path.startsWith("/admin") || path.startsWith("/empresa") || path.startsWith("/cliente")) {
      const u = new URL("/login", req.url);
      u.searchParams.set("next", path);
      return NextResponse.redirect(u);
    }
    return NextResponse.next();
  }

  let role: UserRole;
  try {
    const { payload } = await jwtVerify(token, secret);
    const r = payload.role;
    if (r !== "admin" && r !== "empresa" && r !== "cliente") {
      throw new Error("rol inválido");
    }
    role = r;
  } catch {
    const u = new URL("/login", req.url);
    u.searchParams.set("next", path);
    return NextResponse.redirect(u);
  }

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }
  if (path.startsWith("/empresa") && role !== "empresa") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }
  if (path.startsWith("/cliente") && role !== "cliente") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/empresa/:path*", "/cliente/:path*"],
};
