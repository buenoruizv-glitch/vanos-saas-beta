"use client";

import { trpc } from "@/components/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EmpresaBookingsPage() {
  const list = trpc.booking.list.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Reservas</h1>
        <p className="text-sm text-zinc-600">Listado de reservas del tenant.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {list.isLoading ? (
            <p className="text-sm text-zinc-500">Cargando…</p>
          ) : list.error ? (
            <p className="text-sm text-red-600">{list.error.message}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(list.data ?? []).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.id}</TableCell>
                    <TableCell>{b.clientId}</TableCell>
                    <TableCell>{b.vehicleId}</TableCell>
                    <TableCell>{b.startDate}</TableCell>
                    <TableCell>{b.endDate}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell className="text-right tabular-nums">{b.price} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
