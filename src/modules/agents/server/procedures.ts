import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { agentInsertSchema, agentsUpdateSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
  create: protectedProcedure.input(agentInsertSchema).mutation(async ({ input, ctx }) => {
    const [agent] = await db
      .insert(agents)
      .values({ ...input, userId: ctx.auth.user.id })
      .returning();
    return agent;
  }),

  update: protectedProcedure.input(agentsUpdateSchema).mutation(async ({ input, ctx }) => {
    const [agent] = await db
      .update(agents)
      .set(input)
      .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)))
      .returning();
    
    if (!agent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }
    return agent;
  }),

  remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const [agent] = await db
      .delete(agents)
      .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)))
      .returning();

    if (!agent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }
    return agent;
  }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [agent] = await db
      .select()
      .from(agents)
      .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)));

    if (!agent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }
    return agent;
  }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      const where = and(
        eq(agents.userId, ctx.auth.user.id),
        search ? ilike(agents.name, `%${search}%`) : undefined
      );

      const items = await db
        .select()
        .from(agents)
        .where(where)
        .orderBy(desc(agents.createdAt))
        .limit(pageSize)
        .offset(offset);

      const [{ total }] = await db
        .select({ total: count() })
        .from(agents)
        .where(where);

      return {
        items,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    }),
});
