import { getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import { empresaProcedure, router } from "../trpc";

export const statsRouter = router({
  dashboard: empresaProcedure.query(async ({ ctx }) => {
    const db = getAdminDatabase();
    const [v, b, c] = await Promise.all([
      db.ref(rtdbPaths.vehicles(ctx.tenantId)).get(),
      db.ref(rtdbPaths.bookings(ctx.tenantId)).get(),
      db.ref(rtdbPaths.clients(ctx.tenantId)).get(),
    ]);
    const vehicles = v.val() as Record<string, unknown> | null;
    const bookings = b.val() as Record<string, { status?: string }> | null;
    const clients = c.val() as Record<string, unknown> | null;
    const vehicleCount = vehicles ? Object.keys(vehicles).length : 0;
    const clientCount = clients ? Object.keys(clients).length : 0;
    let activeBookings = 0;
    if (bookings) {
      for (const row of Object.values(bookings)) {
        if (row?.status === "activa" || row?.status === "confirmada") activeBookings += 1;
      }
    }
    return { vehicleCount, clientCount, activeBookings, bookingCount: bookings ? Object.keys(bookings).length : 0 };
  }),
});
