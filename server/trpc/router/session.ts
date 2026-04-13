import { protectedProcedure, router } from "../trpc";

export const sessionRouter = router({
  me: protectedProcedure.query(({ ctx }) => ({
    sub: ctx.session.sub,
    email: ctx.session.email,
    role: ctx.session.role,
    tenantId: ctx.session.tenantId,
  })),
});
