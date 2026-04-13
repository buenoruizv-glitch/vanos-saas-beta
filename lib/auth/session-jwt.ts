import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types/roles";

const getSecret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET debe tener al menos 16 caracteres");
  }
  return new TextEncoder().encode(s);
};

export type SessionClaims = {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
};

export async function signSessionToken(claims: SessionClaims, maxAgeSec = 60 * 60 * 24 * 7): Promise<string> {
  return new SignJWT({
    email: claims.email,
    role: claims.role,
    tenantId: claims.tenantId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, getSecret());
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const role = payload.role as UserRole;
  const tenantId =
    payload.tenantId === null || payload.tenantId === undefined
      ? null
      : String(payload.tenantId);
  if (!sub || !email || !role) {
    throw new Error("Token inválido");
  }
  return { sub, email, role, tenantId };
}
