import { z } from "zod";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import type { Incident } from "@/types/models";
import { empresaProcedure, router } from "../trpc";

export const incidentRouter = router({
  list: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const snap = await db.ref(rtdbPaths.incidents(ctx.tenantId)).get();
    const val = snap.val() as Record<string, Incident> | null;
    if (!val) return [];
    return Object.entries(val).map(([id, i]) => ({ id, ...i }));
  }),
  create: empresaProcedure
    .input(
      z.object({
        category: z.string().min(1),
        description: z.string().min(1),
        bookingId: z.string().optional(),
        vehicleId: z.string().optional(),
        clientId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getAdminDatabase();
      const now = Date.now();
      const payload: Incident = {
        category: input.category,
        description: input.description,
        bookingId: input.bookingId,
        vehicleId: input.vehicleId,
        clientId: input.clientId,
        status: "abierta",
        createdAt: now,
        updatedAt: now,
      };
      const ref = await db.ref(rtdbPaths.incidents(ctx.tenantId)).push(payload);
      return { id: ref.key! };
    }),
});
