import { groupBy } from "lodash";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { type Artwork } from "~/xata";

export const orderRouter = createTRPCRouter({
  my: protectedProcedure
    .query(async ({ ctx }) => {
      const orders = await ctx.db.orderArtwork
        .select(["order.*", "artwork.*", "order.user.*"])
        .getAll()
      const res = orders
        .filter(o => o.artwork && o.order && o.order.user)
        .map(o => ({
          ...o.order!,
          user: o.order!.user!,
          artworkName: o.artwork!.name,
          oId: o.order!.id,
          total: o.artwork!.price,
        }))
      const result = groupBy(res, "oId")
      const grouedOrders = Object.values(result)
      return grouedOrders
        .flatMap(o => o
          .reduce(
            (p, c) => ({
              ...p,
              artworkName: `${p.artworkName}, ${c.artworkName}`,
              total: p.total + c.total
            })
          )
        )
    }),
  create: protectedProcedure
    .input(z.custom<Artwork[]>())
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.create({ user: ctx.session.user })
      for (const artwork of input)
        await ctx.db.orderArtwork.create({ order, artwork })
    })
})
