import { router } from "../trpc";
import { sessionRouter } from "./session";
import { tenantRouter } from "./tenant";
import { vehicleRouter } from "./vehicle";
import { fleetRouter } from "./fleet";
import { bookingRouter } from "./booking";
import { crmRouter } from "./crm";
import { incidentRouter } from "./incident";
import { statsRouter } from "./stats";
import { gpsRouter } from "./gps";
import { analyticsRouter } from "./analytics";
import { aiRouter } from "./ai";

export const appRouter = router({
  session: sessionRouter,
  tenant: tenantRouter,
  vehicle: vehicleRouter,
  fleet: fleetRouter,
  booking: bookingRouter,
  crm: crmRouter,
  incident: incidentRouter,
  stats: statsRouter,
  gps: gpsRouter,
  analytics: analyticsRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
