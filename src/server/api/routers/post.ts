import { z } from "zod";
import { EventEmitter } from "stream";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import {eq} from "drizzle-orm";
const ee=new EventEmitter();
export const postRouter = createTRPCRouter({
  createpost: publicProcedure
    .input(z.object({id:z.number(), name: z.string().min(1), message: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        roomid:input.id,
        creator: input.name,
        content:input.message,
      });
      const post={...input};
      ee.emit('add', post);
      return post;
    }),

  getpost: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx,input }) => {
    const post = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      where: eq(posts.roomid, input.id),
    });
    const messages = post.map((p) => ({
      messageId: p.messageid,
      roomId: p.roomid,
      sender: p.creator,
      content: p.content,
      time: p.createdAt.getTime(),
    }));
    return messages ?? null;
  }),
  getlastpost: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx,input }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      where: eq(posts.roomid, input.id),
    });

})
});
