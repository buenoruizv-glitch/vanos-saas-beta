"use client";

import { trpc } from "@/components/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClienteHomePage() {
  const me = trpc.session.me.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Área cliente</h1>
        <p className="text-sm text-zinc-600">Sesión y datos básicos de tu cuenta.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {me.isLoading ? (
            <p className="text-zinc-500">Cargando…</p>
          ) : me.error ? (
            <p className="text-red-600">{me.error.message}</p>
          ) : (
            <>
              <p>
                <span className="text-zinc-500">Email:</span> {me.data?.email}
              </p>
              <p>
                <span className="text-zinc-500">Tenant:</span>{" "}
                <span className="font-mono text-xs">{me.data?.tenantId ?? "—"}</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
