import { z } from "zod";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import type { Fleet } from "@/types/models";
import { empresaProcedure, router } from "../trpc";

export const fleetRouter = router({
  list: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const snap = await db.ref(rtdbPaths.fleets(ctx.tenantId)).get();
    const val = snap.val() as Record<string, Fleet> | null;
    if (!val) return [];
    return Object.entries(val).map(([id, f]) => ({ id, ...f }));
  }),
  create: empresaProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        region: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getAdminDatabase();
      const now = Date.now();
      const payload: Fleet = {
        name: input.name,
        description: input.description,
        region: input.region,
        color: input.color,
        createdAt: now,
        updatedAt: now,
      };
      const ref = await db.ref(rtdbPaths.fleets(ctx.tenantId)).push(payload);
      return { id: ref.key! };
    }),
});
