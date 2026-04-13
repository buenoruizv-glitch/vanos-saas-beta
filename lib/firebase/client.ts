import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta ${name} en .env.local`);
  return v;
}

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0]!;
    return app;
  }
  app = initializeApp({
    apiKey: requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    databaseURL: requireEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
  });
  return app;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDatabase(): Database {
  return getDatabase(getFirebaseApp());
}
