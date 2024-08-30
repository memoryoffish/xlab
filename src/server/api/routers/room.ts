import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { rooms } from "~/server/db/schema";
import {eq} from "drizzle-orm";
export const roomRouter = createTRPCRouter({
  createroom: publicProcedure
    .input(z.object({    username:z.string().min(1),roomName:z.string().min(1)}))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(rooms).values({
        creator: input.username,
        roomname: input.roomName,
      });
    }),

  getroomlist: publicProcedure.query(async ({ ctx }) => {
    const rooms = await ctx.db.query.rooms.findMany({
      orderBy: (rooms, { desc }) => [desc(rooms.id)],
    });
    return rooms;
  }),
  deleteroom: publicProcedure.input(
    z.object({ id: z.number() })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.delete(rooms).where(eq(rooms.id, input.id));
  })
});
