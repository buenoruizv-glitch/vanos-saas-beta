import { getCookieFromHeader } from "@/lib/auth/parse-cookie";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken, type SessionClaims } from "@/lib/auth/session-jwt";

export type TRPCContext = {
  req: Request;
  session: SessionClaims | null;
};

export async function createTRPCContext(opts: { req: Request }): Promise<TRPCContext> {
  const cookie = opts.req.headers.get("cookie");
  const raw = getCookieFromHeader(cookie, SESSION_COOKIE);
  let session: SessionClaims | null = null;
  if (raw) {
    try {
      session = await verifySessionToken(raw);
    } catch {
      session = null;
    }
  }
  return { req: opts.req, session };
}
