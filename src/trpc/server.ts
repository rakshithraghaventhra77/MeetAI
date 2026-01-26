import { createTRPCReact } from '@trpc/react-query';
import { agentsRouter } from '@/modules/agents/server/procedures';

export const trpc = {
  agents: agentsRouter
};

export type AppRouter = typeof trpc;
