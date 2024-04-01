import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  updateBio: protectedProcedure
    .input(z.string().min(5))
    .mutation(({ ctx, input: bio }) => {
      return ctx.db.nextauth_users.update(ctx.session.user.id, { bio })
    }),
  withId: publicProcedure
    .input(z.string().min(1))
    .query(({ ctx, input: id }) => {
      return ctx.db.nextauth_users.read(id)
    }),
  socialMediasOf: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input: id }) => {
      const socialMedias = await ctx.db.socialMedia.getAll()
      const userSocialMedia = await ctx.db.userSocialMedia.filter({ "user.id": id }).select(["socialMedia.*", "link"]).getAll()
      return { socialMedias, userSocialMedia }
    }),
  addSocialMedia: protectedProcedure
    .input(z.object({ link: z.string().url(), socialMedia: z.string().min(1) }))
    .mutation(async ({ ctx, input: { link, socialMedia } }) => {
      return ctx.db.userSocialMedia.create({ link, user: ctx.session.user.id, socialMedia })
    }),
})
