/** Parse a single cookie value from the Cookie header (RFC6265-ish). */
export function getCookieFromHeader(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  const parts = header.split(";").map((p) => p.trim());
  const prefix = `${name}=`;
  for (const p of parts) {
    if (p.startsWith(prefix)) {
      return decodeURIComponent(p.slice(prefix.length));
    }
  }
  return undefined;
}
