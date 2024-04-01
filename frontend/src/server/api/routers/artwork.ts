import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Artwork } from "~/xata";

export const artworkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.custom<Omit<Artwork, "artist" | "id">>())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.artwork.create({
        ...input,
        artist: ctx.session.user.id,
      }, ["image.uploadUrl", "secondaryAttachments.uploadUrl"])
    }),
  update: protectedProcedure
    .input(z.custom<Partial<Omit<Artwork, "artist" | "id" | "image" | "secondaryAttachments">> & { id: string }>())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.artwork.update({
        ...input,
      })
    }),
  all: publicProcedure
    .input(z.object({ limit: z.number().nullish() }).default({}))
    .query(({ ctx, input: { limit } }) => {
      if (!limit) return ctx.db.artwork
        .select(["name", "price", "style", "artist.*", "image.url"])
        .getAll()

      return ctx.db.artwork
        .select(["name", "price", "style", "size", "artist.*", "image.url"])
        .getMany({
          pagination: {
            size: limit ?? undefined,
          },
        });
    }),
  my: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.artwork
        .select(["name", "price", "style", "size", "artist.*", "image.url", "availableQuantity", "category"])
        .sort("xata.updatedAt", "desc").sort("xata.createdAt", "desc")
        .filter({ "artist.id": ctx.session.user.id }).getAll();
    }),
  by: publicProcedure
    .input(z.string())
    .query(({ ctx, input: id }) => {
      return ctx.db.artwork
        .select(["name", "price", "style", "size", "artist.*", "image.url"])
        .sort("xata.updatedAt", "desc").sort("xata.createdAt", "desc")
        .filter({ "artist.id": id })
        .getAll();
    }),
  search: protectedProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const all = () => ctx.db.artwork.getAll();
      let result: Awaited<ReturnType<typeof all>>
      if (!input) {
        result = await all();
      } else {
        const search = await ctx.db.artwork.search(input, {
          target: [
            "size", "price", "style", "name"
          ],
          fuzziness: 2,
        }).then(c => c.records)
        if (search.length == 0) result = await all();
        // @ts-expect-error xxx
        else result = search
      }
      const wishlists = !ctx.session ? [] : await ctx.db.wishlist.filter({ "user.id": ctx.session.user.id }).getAll()
      return result.map(r => ({ ...r, isInWishlist: wishlists.some(w => w?.artwork?.id === r.id) }))
    }),
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),
});
