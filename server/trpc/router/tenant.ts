import { z } from "zod";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { listTenantsForAdmin } from "@/lib/firebase/firestore-users";
import { adminProcedure, empresaProcedure, router } from "../trpc";

export const tenantRouter = router({
  listForAdmin: adminProcedure.query(async () => {
    return listTenantsForAdmin();
  }),
  mine: empresaProcedure.query(async ({ ctx }) => {
    const snap = await getAdminFirestore().collection("tenants").doc(ctx.tenantId).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as { id: string } & Record<string, unknown>;
  }),
  updateMine: empresaProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        cities: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ref = getAdminFirestore().collection("tenants").doc(ctx.tenantId);
      await ref.set(
        {
          ...(input.name != null ? { name: input.name } : {}),
          ...(input.cities != null ? { cities: input.cities } : {}),
          updatedAt: Date.now(),
        },
        { merge: true },
      );
      return { ok: true as const };
    }),
});
