/**
 * Lee un JSON de cuenta de servicio de Firebase y escribe líneas listas para .env.local.
 * Uso: node scripts/inject-admin-from-json.cjs ruta/al/servicio.json
 * Copia la salida a mano en .env.local (no sobrescribimos el archivo entero).
 */

const fs = require("fs");
const path = require("path");

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("Uso: node scripts/inject-admin-from-json.cjs <service-account.json>");
  process.exit(1);
}

const abs = path.resolve(process.cwd(), jsonPath);
const raw = fs.readFileSync(abs, "utf8");
const j = JSON.parse(raw);

if (!j.client_email || !j.private_key || !j.project_id) {
  console.error("JSON inválido: esperaba client_email, private_key, project_id");
  process.exit(1);
}

const pk = String(j.private_key).replace(/\r\n/g, "\n");
const escaped = JSON.stringify(pk);

console.log(`FIREBASE_ADMIN_PROJECT_ID=${j.project_id}`);
console.log(`FIREBASE_ADMIN_CLIENT_EMAIL=${j.client_email}`);
console.log(`FIREBASE_ADMIN_PRIVATE_KEY=${escaped}`);
