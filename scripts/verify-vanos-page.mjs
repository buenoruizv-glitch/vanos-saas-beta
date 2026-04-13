/**
 * Falla el build si app/page.tsx no es la landing VanOS (evita desplegar la plantilla por defecto).
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const p = resolve(process.cwd(), "app", "page.tsx");
let s;
try {
  s = readFileSync(p, "utf8");
} catch {
  console.error("[verify-vanos-page] No existe app/page.tsx");
  process.exit(1);
}

const markers = ["Opera tu alquiler de autocaravanas", "SaaS · flotas", 'href="/login"'];
for (const m of markers) {
  if (!s.includes(m)) {
    console.error(`[verify-vanos-page] app/page.tsx debe incluir la landing VanOS (falta: ${m.slice(0, 40)}…)`);
    process.exit(1);
  }
}

if (s.includes("nextjs.org/icons/next.svg") || s.includes("Get started by editing")) {
  console.error("[verify-vanos-page] app/page.tsx parece la plantilla por defecto de create-next-app.");
  process.exit(1);
}

console.log("[verify-vanos-page] OK");
