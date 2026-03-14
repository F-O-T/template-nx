import type { RouterClient } from "@orpc/server";

import {
  rateLimitedProtectedProcedure,
  rateLimitedPublicProcedure,
} from "../index";

export const appRouter = {
  healthCheck: rateLimitedPublicProcedure.handler(() => {
    return "OK";
  }),
  privateData: rateLimitedProtectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
