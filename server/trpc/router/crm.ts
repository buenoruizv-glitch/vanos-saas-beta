import { z } from "zod";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import type { Client } from "@/types/models";
import { empresaProcedure, router } from "../trpc";

export const crmRouter = router({
  listClients: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const snap = await db.ref(rtdbPaths.clients(ctx.tenantId)).get();
    const val = snap.val() as Record<string, Client> | null;
    if (!val) return [];
    return Object.entries(val).map(([id, c]) => ({ id, ...c }));
  }),
  createClient: empresaProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        dni: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getAdminDatabase();
      const now = Date.now();
      const payload: Client = {
        name: input.name,
        email: input.email,
        phone: input.phone,
        dni: input.dni,
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };
      const ref = await db.ref(rtdbPaths.clients(ctx.tenantId)).push(payload);
      return { id: ref.key! };
    }),
});
