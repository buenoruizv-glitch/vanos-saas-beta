"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { homeForRole } from "@/lib/routes";
import type { UserRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginFormInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = (await res.json()) as { ok?: boolean; role?: UserRole; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo crear la sesión");
        return;
      }
      const role = data.role;
      if (!role) {
        setError("Sesión sin rol");
        return;
      }
      const fallback = homeForRole(role);
      const dest = next && next.startsWith("/") ? next : fallback;
      router.replace(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8 text-center">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          VanOS
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-zinc-600">Accede con tu email y contraseña de Firebase.</p>
      </div>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-zinc-900 underline">
          Regístrate
        </Link>
      </p>
    </>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
          <p className="text-center text-sm text-zinc-500">Cargando…</p>
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
