import type { UserRole } from "./roles";

export type PlanId = "starter" | "pro" | "business" | "enterprise";

export type UserProfile = {
  email: string;
  name: string;
  role: UserRole;
  tenantId: string | null;
  createdAt: number;
};

export type Tenant = {
  name: string;
  plan: PlanId;
  stripeCustomerId?: string | null;
  cities: string[];
  vehicleLimit: number;
  createdAt: number;
  subscriptionStatus?: string;
  subscriptionActive?: boolean;
  updatedAt?: number;
};

export type Fleet = {
  name: string;
  description?: string;
  region?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
};

export type VehicleStatus = "disponible" | "alquilada" | "mantenimiento";

export type Vehicle = {
  plate: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  city: string;
  status: VehicleStatus;
  equipment: string[];
  fleetId?: string | null;
  gpsTrackerId?: string | null;
  fuelType?: string | null;
  km?: number;
  nextITV?: string | null;
  nextInsurance?: string | null;
  photos?: string[];
  createdAt: number;
  updatedAt: number;
};

export type BookingStatus =
  | "pendiente"
  | "confirmada"
  | "activa"
  | "finalizada"
  | "cancelada";

export type Booking = {
  clientId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  price: number;
  deposit?: number;
  stripePaymentId?: string | null;
  contractUrl?: string | null;
  contractStoragePath?: string | null;
  contractGeneratedAt?: number;
  createdAt: number;
  updatedAt: number;
};

export type Client = {
  name: string;
  email: string;
  phone?: string;
  dni?: string;
  notes?: string;
  score?: string;
  totalSpent?: number;
  createdAt: number;
  updatedAt: number;
};

export type IncidentStatus = "abierta" | "en_curso" | "cerrada";

export type Incident = {
  bookingId?: string;
  vehicleId?: string;
  clientId?: string;
  category: string;
  description: string;
  photos?: string[];
  status: IncidentStatus;
  createdAt: number;
  updatedAt: number;
};
