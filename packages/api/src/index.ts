import { ORPCError, os } from "@orpc/server";
import { aj, tokenBucket, toArcjetRequest } from "@core/arcjet";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

const rateLimitedAj = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    refillRate: 10,
    interval: 60,
    capacity: 20,
  }),
);

const rateLimit = o.middleware(async ({ context, next }) => {
  const decision = await rateLimitedAj.protect(toArcjetRequest(context.req), {
    requested: 1,
  });

  if (decision.isDenied()) {
    throw new ORPCError("TOO_MANY_REQUESTS", {
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  return next({});
});

export const protectedProcedure = publicProcedure.use(requireAuth);

export const rateLimitedPublicProcedure = publicProcedure.use(rateLimit);
export const rateLimitedProtectedProcedure = publicProcedure.use(rateLimit).use(requireAuth);
