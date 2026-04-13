import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import { empresaProcedure, router } from "../trpc";

export const gpsRouter = router({
  snapshot: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const snap = await db.ref(rtdbPaths.gps(ctx.tenantId)).get();
    const val = snap.val() as Record<string, { lat?: number; lng?: number; updatedAt?: number }> | null;
    if (!val) return [];
    return Object.entries(val).map(([vehicleId, pos]) => ({
      vehicleId,
      lat: pos.lat ?? null,
      lng: pos.lng ?? null,
      updatedAt: pos.updatedAt ?? null,
    }));
  }),
});
