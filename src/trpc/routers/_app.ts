import { z } from 'zod';
import { router, publicProcedure } from '../init';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().optional() }).optional())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
