/**
 * URL pública del sitio (sin barra final).
 * En Vercel, `VERCEL_URL` la inyecta la plataforma: no hace falta duplicar la URL en NEXT_PUBLIC_APP_URL.
 * En local, usa `NEXT_PUBLIC_APP_URL` (p. ej. http://localhost:3000).
 */
export function getPublicSiteUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return getServerPublicSiteUrl();
}

export function getServerPublicSiteUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function getMetadataBase(): URL {
  try {
    return new URL(getServerPublicSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
