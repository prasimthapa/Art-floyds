import { groupBy, omit } from "lodash";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  analytics: protectedProcedure
    .query(async ({ ctx }) => {
      // const data = await ctx.db.artwork.summarize({
      //   columns: ["availableQuantity", "price"],
      //   filter: {
      //     "artist.id": ctx.session.user.id,
      //   },
      //   summaries: {
      //     // count: { count: "xata.createdAt" },
      //     avaragePrice: { average: "price" },
      //     maxAvailableQuantity: { max: "availableQuantity" },
      //     minAvailableQuantity: { min: "availableQuantity" },
      //   },
      // })
      const data = await ctx.db
        .artwork
        .select([
          "name",
          "artist",
          "price",
        ])
        .filter({ "artist.id": ctx.session.user.id })
        .getAll();

      const chartdata = data.map(item => ({
        date: item.xata.createdAt.toISOString().slice(0, 10),
        [item.name ?? ""]: item.price,
      }));
      const grouped = groupBy(chartdata, c => c.date);
      return Object.entries(grouped).map(([k, v]) => ({ date: k, ...v.map(a => omit(a, "date")).reduce((p, c) => ({ ...p, ...c })) }))
    }),
})
