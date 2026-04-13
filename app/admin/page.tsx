"use client";

import { trpc } from "@/components/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHomePage() {
  const { data, isLoading, error } = trpc.analytics.overview.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Administración</h1>
        <p className="text-sm text-zinc-600">Visión global de tenants y vehículos en RTDB.</p>
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : isLoading ? (
        <p className="text-sm text-zinc-500">Cargando…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Empresas (Firestore)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{data?.tenantCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehículos (RTDB, suma)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{data?.totalVehicles ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
