import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  all: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.event.getAll({ sort: [{ "xata.updatedAt": "desc" }, { "xata.createdAt": "desc" }] })
    }),
  create: protectedProcedure
    .input(z.object({ dateTime: z.date().min(new Date()), location: z.string().min(1), name: z.string().min(1), description: z.ostring() }))
    .mutation(({ ctx, input: { dateTime, location, name, description } }) => {
      return ctx.db.event.create({ dateTime, location, name, description })
    }),
  request: protectedProcedure
    .input(z.object({ email: z.string().email(), phone: z.string().min(1), eventId: z.string().min(1) }))
    .mutation(({ ctx, input: { email, phone, eventId } }) => {
      return ctx.db.eventRequest.create({ user: ctx.session.user.id, email, phone, event: eventId })
    }),
})
