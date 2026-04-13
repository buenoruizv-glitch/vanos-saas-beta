import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken, type SessionClaims } from "@/lib/auth/session-jwt";

export async function getServerSession(): Promise<SessionClaims | null> {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
