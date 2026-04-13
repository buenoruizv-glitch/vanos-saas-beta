"use client";

import { trpc } from "@/components/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmpresaDashboardPage() {
  const { data, isLoading, error } = trpc.stats.dashboard.useQuery();
  const tenant = trpc.tenant.mine.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Panel empresa</h1>
        <p className="text-sm text-zinc-600">
          {tenant.data?.name ? (
            <>
              <span className="font-medium text-zinc-800">{String(tenant.data.name)}</span>
            </>
          ) : (
            "Resumen operativo de tu flota."
          )}
        </p>
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : isLoading ? (
        <p className="text-sm text-zinc-500">Cargando…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{data?.vehicleCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{data?.clientCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reservas activas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{data?.activeBookings ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{data?.bookingCount ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
