import "server-only";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { UserProfile } from "@/types/models";
import type { UserRole } from "@/types/roles";

const COLLECTION = "users";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getAdminFirestore().collection(COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  const d = snap.data() as UserProfile;
  return d;
}

export async function setUserProfile(uid: string, data: UserProfile): Promise<void> {
  await getAdminFirestore().collection(COLLECTION).doc(uid).set(data, { merge: true });
}

export async function countUsers(): Promise<number> {
  const snap = await getAdminFirestore().collection(COLLECTION).get();
  return snap.size;
}

export async function createTenantDoc(
  tenantId: string,
  data: import("@/types/models").Tenant,
): Promise<void> {
  await getAdminFirestore().collection("tenants").doc(tenantId).set(data);
}

export async function getTenantDoc(tenantId: string): Promise<import("@/types/models").Tenant | null> {
  const snap = await getAdminFirestore().collection("tenants").doc(tenantId).get();
  if (!snap.exists) return null;
  return snap.data() as import("@/types/models").Tenant;
}

export async function listTenantsForAdmin(): Promise<
  { id: string; data: import("@/types/models").Tenant }[]
> {
  const snap = await getAdminFirestore().collection("tenants").limit(100).get();
  const rows = snap.docs.map((d) => ({
    id: d.id,
    data: d.data() as import("@/types/models").Tenant,
  }));
  rows.sort((a, b) => (b.data.createdAt ?? 0) - (a.data.createdAt ?? 0));
  return rows;
}

export function buildUserProfile(input: {
  email: string;
  name: string;
  role: UserRole;
  tenantId: string | null;
}): UserProfile {
  return {
    email: input.email,
    name: input.name,
    role: input.role,
    tenantId: input.tenantId,
    createdAt: Date.now(),
  };
}
