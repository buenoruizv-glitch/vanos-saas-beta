import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Inicia sesión" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireAuth);

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo administradores" });
  }
  return next({ ctx });
});

export const empresaProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.role !== "empresa" || !ctx.session.tenantId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo cuentas empresa" });
  }
  return next({
    ctx: {
      ...ctx,
      tenantId: ctx.session.tenantId,
    },
  });
});

export const clienteProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.role !== "cliente") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo clientes" });
  }
  return next({ ctx });
});
