import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  buildUserProfile,
  countUsers,
  createTenantDoc,
  setUserProfile,
} from "@/lib/firebase/firestore-users";
import type { PlanId } from "@/types/models";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["admin", "empresa", "cliente"]),
  tenantName: z.string().min(1).optional(),
  tenantId: z.string().min(1).optional(),
  adminSecret: z.string().optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  }
  const { email, password, name, role, tenantName, tenantId, adminSecret } = parsed.data;

  const totalUsers = await countUsers();

  if (role === "admin" && totalUsers > 0) {
    const secret = process.env.ADMIN_REGISTER_SECRET;
    if (!secret || adminSecret !== secret) {
      return NextResponse.json({ error: "Registro admin no permitido" }, { status: 403 });
    }
  }

  const auth = getAdminAuth();

  if (role === "empresa") {
    if (!tenantName?.trim()) {
      return NextResponse.json({ error: "Indica el nombre de la empresa" }, { status: 400 });
    }
    const user = await auth.createUser({ email, password, displayName: name });
    const newTenantId = randomUUID();
    const plan: PlanId = "starter";
    await createTenantDoc(newTenantId, {
      name: tenantName.trim(),
      plan,
      cities: [],
      vehicleLimit: 50,
      createdAt: Date.now(),
    });
    await setUserProfile(
      user.uid,
      buildUserProfile({
        email,
        name,
        role: "empresa",
        tenantId: newTenantId,
      }),
    );
    return NextResponse.json({ ok: true, uid: user.uid });
  }

  if (role === "cliente") {
    const resolvedTenantId = tenantId ?? process.env.DEMO_TENANT_ID ?? null;
    if (!resolvedTenantId) {
      return NextResponse.json(
        { error: "Indica tenantId o configura DEMO_TENANT_ID en .env.local" },
        { status: 400 },
      );
    }
    const user = await auth.createUser({ email, password, displayName: name });
    await setUserProfile(
      user.uid,
      buildUserProfile({
        email,
        name,
        role: "cliente",
        tenantId: resolvedTenantId,
      }),
    );
    return NextResponse.json({ ok: true, uid: user.uid });
  }

  const user = await auth.createUser({ email, password, displayName: name });
  await setUserProfile(
    user.uid,
    buildUserProfile({
      email,
      name,
      role: "admin",
      tenantId: null,
    }),
  );
  return NextResponse.json({ ok: true, uid: user.uid });
}
