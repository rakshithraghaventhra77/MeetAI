import { router } from '../init';
import { agentsRouter } from '@/modules';

export const appRouter = router({
  agents: agentsRouter,
});

export type AppRouter = typeof appRouter;
