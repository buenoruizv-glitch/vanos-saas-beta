"use client";

import { useState } from "react";
import { trpc } from "@/components/providers/trpc-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EmpresaVehiclesPage() {
  const utils = trpc.useUtils();
  const list = trpc.vehicle.list.useQuery();
  const create = trpc.vehicle.create.useMutation({
    onSuccess: () => void utils.vehicle.list.invalidate(),
  });

  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2024);
  const [seats, setSeats] = useState(4);
  const [city, setCity] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({
      plate,
      brand,
      model,
      year,
      seats,
      city,
      status: "disponible",
      equipment: [],
    });
    setPlate("");
    setBrand("");
    setModel("");
    setCity("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Vehículos</h1>
        <p className="text-sm text-zinc-600">Alta y listado en tiempo real (RTDB).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nuevo vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void onCreate(e)} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="plate">Matrícula</Label>
              <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Plazas</Label>
              <Input
                id="seats"
                type="number"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-3">
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Guardando…" : "Añadir vehículo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flota actual</CardTitle>
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
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(list.data ?? []).map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.plate}</TableCell>
                    <TableCell>
                      {v.brand} {v.model}
                    </TableCell>
                    <TableCell>{v.city}</TableCell>
                    <TableCell>{v.status}</TableCell>
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
