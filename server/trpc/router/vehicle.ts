import { z } from "zod";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import type { Vehicle } from "@/types/models";
import { empresaProcedure, router } from "../trpc";

const vehicleInput = z.object({
  plate: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1990).max(2035),
  seats: z.number().int().min(1).max(20),
  city: z.string().min(1),
  status: z.enum(["disponible", "alquilada", "mantenimiento"]),
  equipment: z.array(z.string()).default([]),
  fleetId: z.string().nullable().optional(),
});

export const vehicleRouter = router({
  list: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const snap = await db.ref(rtdbPaths.vehicles(ctx.tenantId)).get();
    const val = snap.val() as Record<string, Vehicle> | null;
    if (!val) return [];
    return Object.entries(val).map(([id, v]) => ({ id, ...v }));
  }),
  create: empresaProcedure.input(vehicleInput).mutation(async ({ ctx, input }) => {
    const db = getAdminDatabase();
    const now = Date.now();
    const payload: Vehicle = {
      ...input,
      equipment: input.equipment ?? [],
      fleetId: input.fleetId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await db.ref(rtdbPaths.vehicles(ctx.tenantId)).push(payload);
    return { id: ref.key! };
  }),
  update: empresaProcedure
    .input(
      z.object({
        id: z.string().min(1),
        patch: vehicleInput.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getAdminDatabase();
      const path = rtdbPaths.vehicle(ctx.tenantId, input.id);
      const snap = await db.ref(path).get();
      if (snap.val() == null) throw new Error("Vehículo no encontrado");
      const cur = snap.val() as Vehicle;
      const next: Vehicle = {
        ...cur,
        ...input.patch,
        updatedAt: Date.now(),
      };
      await db.ref(path).set(next);
      return { ok: true as const };
    }),
  remove: empresaProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await getAdminDatabase().ref(rtdbPaths.vehicle(ctx.tenantId, input.id)).remove();
    return { ok: true as const };
  }),
});
