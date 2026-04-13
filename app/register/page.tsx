"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { homeForRole } from "@/lib/routes";
import type { UserRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("empresa");
  const [tenantName, setTenantName] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          tenantName: role === "empresa" ? tenantName : undefined,
          tenantId: role === "cliente" ? tenantId || undefined : undefined,
          adminSecret: role === "admin" ? adminSecret || undefined : undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Error al registrar");
        return;
      }
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const sessionData = (await sessionRes.json()) as { role?: UserRole; error?: string };
      if (!sessionRes.ok) {
        setError(sessionData.error ?? "Cuenta creada pero no se pudo iniciar sesión");
        return;
      }
      const r = sessionData.role;
      if (r) router.replace(homeForRole(r));
      else router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          VanOS
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">Crear cuenta</h1>
        <p className="mt-1 text-sm text-zinc-600">Registro vía API y sesión con Firebase.</p>
      </div>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
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
          <Label htmlFor="password">Contraseña (mín. 6)</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Tipo de cuenta</Label>
          <select
            id="role"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="empresa">Empresa (flota)</option>
            <option value="cliente">Cliente final</option>
            <option value="admin">Administrador plataforma</option>
          </select>
        </div>
        {role === "empresa" ? (
          <div className="space-y-2">
            <Label htmlFor="tenantName">Nombre de la empresa</Label>
            <Input id="tenantName" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
          </div>
        ) : null}
        {role === "cliente" ? (
          <div className="space-y-2">
            <Label htmlFor="tenantId">ID empresa (opcional si hay DEMO_TENANT_ID)</Label>
            <Input
              id="tenantId"
              placeholder="UUID del tenant"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
          </div>
        ) : null}
        {role === "admin" ? (
          <div className="space-y-2">
            <Label htmlFor="adminSecret">Clave admin (solo si ya existe otro usuario)</Label>
            <Input
              id="adminSecret"
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
            />
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creando…" : "Registrarme"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
