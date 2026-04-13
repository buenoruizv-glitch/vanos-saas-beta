export const rtdbPaths = {
  tenantRoot: (tenantId: string) => `tenants/${tenantId}`,
  fleets: (tenantId: string) => `tenants/${tenantId}/fleets`,
  fleet: (tenantId: string, fleetId: string) => `tenants/${tenantId}/fleets/${fleetId}`,
  vehicles: (tenantId: string) => `tenants/${tenantId}/vehicles`,
  vehicle: (tenantId: string, vehicleId: string) =>
    `tenants/${tenantId}/vehicles/${vehicleId}`,
  bookings: (tenantId: string) => `tenants/${tenantId}/bookings`,
  booking: (tenantId: string, bookingId: string) =>
    `tenants/${tenantId}/bookings/${bookingId}`,
  clients: (tenantId: string) => `tenants/${tenantId}/clients`,
  client: (tenantId: string, clientId: string) =>
    `tenants/${tenantId}/clients/${clientId}`,
  incidents: (tenantId: string) => `tenants/${tenantId}/incidents`,
  incident: (tenantId: string, incidentId: string) =>
    `tenants/${tenantId}/incidents/${incidentId}`,
  gps: (tenantId: string) => `tenants/${tenantId}/gps`,
  vehicleGps: (tenantId: string, vehicleId: string) =>
    `tenants/${tenantId}/gps/${vehicleId}`,
};
