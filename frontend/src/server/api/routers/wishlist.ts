import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const wishlistRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const artwork = await ctx.db.artwork.readOrThrow(artworkId)
      return ctx.db.wishlist.create({ artwork, user: ctx.session.user.id })
    }),
  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: artworkId }) => {
      const wishlists = await ctx.db.wishlist.filter({ "artwork.id": artworkId, "user.id": ctx.session.user.id }).getAll()
      return ctx.db.wishlist.delete(wishlists.map(w => w.id))
    }),
  search: protectedProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const all = () => ctx.db.wishlist.select(["artwork.*", "user.*"]).filter({ "user.id": ctx.session.user.id }).getAll();
      let result: Awaited<ReturnType<typeof all>>
      if (!input) {
        result = await all();
      } else {
        const artworkSearch = await ctx.db.artwork.search(input, {
          target: [
            "size", "price", "style", "name"
          ],
          fuzziness: 2,
        })
        const wishlist = await ctx.db.wishlist.select(["artwork.*"]).filter({
          "user.id": ctx.session.user.id,
        }).getAll();
        const search = wishlist.filter(l => artworkSearch.records.map(r => r.id).includes(l.artwork?.id ?? ''))
        if (search.length == 0) result = await all();
        // @ts-expect-error xxx
        else result = search
      }
      return result.filter(r => r.artwork && r.user?.id === ctx.session.user.id).map(r => r.artwork!)
    }),
})
