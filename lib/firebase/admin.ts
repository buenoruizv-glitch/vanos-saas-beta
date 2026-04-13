import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getDatabase, type Database } from "firebase-admin/database";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function getPrivateKey(): string {
  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "";
  return raw.replace(/\\n/g, "\n");
}

export function getAdminApp(): App {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0]!;
    return app;
  }
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Faltan variables FIREBASE_ADMIN_* o NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  }
  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
  return app;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminDatabase(): Database {
  return getDatabase(getAdminApp());
}
