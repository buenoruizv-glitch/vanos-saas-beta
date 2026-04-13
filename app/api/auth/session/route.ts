import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { signSessionToken } from "@/lib/auth/session-jwt";
import { getUserProfile } from "@/lib/firebase/firestore-users";

export const runtime = "nodejs";

const bodySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Falta idToken" }, { status: 400 });
  }
  const decoded = await getAdminAuth().verifyIdToken(parsed.data.idToken);
  const profile = await getUserProfile(decoded.uid);
  if (!profile) {
    return NextResponse.json({ error: "Usuario no registrado en VanOS" }, { status: 400 });
  }
  const token = await signSessionToken({
    sub: decoded.uid,
    email: profile.email,
    role: profile.role,
    tenantId: profile.tenantId ?? null,
  });
  const res = NextResponse.json({ ok: true, role: profile.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
