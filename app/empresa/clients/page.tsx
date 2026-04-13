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

export default function EmpresaClientsPage() {
  const utils = trpc.useUtils();
  const list = trpc.crm.listClients.useQuery();
  const create = trpc.crm.createClient.useMutation({
    onSuccess: () => void utils.crm.listClients.invalidate(),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync({ name, email });
    setName("");
    setEmail("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Clientes</h1>
        <p className="text-sm text-zinc-600">CRM ligero en RTDB.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nuevo cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void onCreate(e)} className="flex max-w-md flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Guardando…" : "Añadir"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Listado</CardTitle>
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(list.data ?? []).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
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
