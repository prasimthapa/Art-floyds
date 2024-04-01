import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type Chat } from "~/xata";

export const forumRouter = createTRPCRouter({
	all: protectedProcedure
		.query(({ ctx }) => ctx.db.chat.sort("xata.createdAt", "desc").select(["*", "owner.*"]).filter({ type: "forum" }).getAll()),
	create: protectedProcedure
		.input(z.custom<Pick<Chat, "title" | "description">>())
		.mutation(async ({ ctx, input: { title, description } }) => {
			const chat = await ctx.db.chat.create({
				type: "forum",
				title,
				description,
				owner: ctx.session.user.id,
			})
			return chat
		}),
	delete: protectedProcedure
		.input(z.string())
		.mutation(({ ctx, input: id }) => ctx.db.chat.delete({ id })),
	deleteReply: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input: id }) => {
			const { chat } = await ctx.db.chatMessage.deleteOrThrow({ id })
			await ctx.pusher.trigger(`chat-${chat?.id ?? ''}`, 'delete-reply', id)
		}),
	byId: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input: id }) => {
			const replies = await ctx.db.chatMessage
				.select(["*", "sender.*"])
				.sort("xata.createdAt", "desc")
				.filter({ "chat.id": id }).getAll()
			const chat = await ctx.db.chat.filter({ id }).select(["*", "owner.*"]).getFirstOrThrow()
			return {
				...chat,
				replies,
			}
		}),
	reply: protectedProcedure
		.input(z.object({ chatId: z.string(), message: z.string() }))
		.mutation(async ({ ctx, input: { chatId, message } }) => {
			const msg = await ctx.db.chatMessage.create({
				chat: chatId,
				message,
				sender: ctx.session.user.id,
			}, ["chat.id", "sender.*", "*"])
			await ctx.pusher.trigger(`chat-${msg?.chat?.id ?? ''}`, 'reply', msg)
		}),
})
