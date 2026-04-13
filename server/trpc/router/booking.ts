import { z } from "zod";
import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import type { Booking } from "@/types/models";
import { empresaProcedure, router } from "../trpc";

export const bookingRouter = router({
  list: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const snap = await db.ref(rtdbPaths.bookings(ctx.tenantId)).get();
    const val = snap.val() as Record<string, Booking> | null;
    if (!val) return [];
    return Object.entries(val).map(([id, b]) => ({ id, ...b }));
  }),
  create: empresaProcedure
    .input(
      z.object({
        clientId: z.string().min(1),
        vehicleId: z.string().min(1),
        startDate: z.string().min(1),
        endDate: z.string().min(1),
        status: z.enum(["pendiente", "confirmada", "activa", "finalizada", "cancelada"]),
        price: z.number().nonnegative(),
        deposit: z.number().nonnegative().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getAdminDatabase();
      const now = Date.now();
      const payload: Booking = {
        clientId: input.clientId,
        vehicleId: input.vehicleId,
        startDate: input.startDate,
        endDate: input.endDate,
        status: input.status,
        price: input.price,
        deposit: input.deposit,
        createdAt: now,
        updatedAt: now,
      };
      const ref = await db.ref(rtdbPaths.bookings(ctx.tenantId)).push(payload);
      return { id: ref.key! };
    }),
});
