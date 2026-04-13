/**
 * Comprueba variables mínimas para VanOS (local o CI).
 * Uso: npm run beta:check-env
 * Carga .env.local si existe (sin dependencia extra).
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const txt = readFileSync(envPath, "utf8");
  for (const line of txt.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (key && (process.env[key] === undefined || process.env[key] === "")) {
      process.env[key] = val;
    }
  }
}

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "SESSION_SECRET",
];

const missing = required.filter((k) => {
  const v = process.env[k];
  return v == null || String(v).trim() === "";
});

if (missing.length) {
  console.error("[beta:check-env] Faltan variables:");
  for (const k of missing) console.error(`  - ${k}`);
  process.exit(1);
}

console.log("[beta:check-env] Variables obligatorias presentes.");
