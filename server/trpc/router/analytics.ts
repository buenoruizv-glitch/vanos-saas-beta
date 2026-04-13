import { getAdminFirestore, getAdminDatabase } from "@/lib/firebase/admin";
import { rtdbPaths } from "@/lib/rtdb/paths";
import { adminProcedure, router } from "../trpc";

export const analyticsRouter = router({
  overview: adminProcedure.query(async () => {
    const fs = getAdminFirestore();
    const tenantsSnap = await fs.collection("tenants").get();
    const tenantCount = tenantsSnap.size;
    let totalVehicles = 0;
    const db = getAdminDatabase();
    for (const doc of tenantsSnap.docs) {
      const id = doc.id;
      const v = await db.ref(rtdbPaths.vehicles(id)).get();
      const val = v.val() as Record<string, unknown> | null;
      totalVehicles += val ? Object.keys(val).length : 0;
    }
    return { tenantCount, totalVehicles };
  }),
});
