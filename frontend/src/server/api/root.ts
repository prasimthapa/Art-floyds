import { createTRPCRouter } from "~/server/api/trpc";
import { artworkRouter } from "./routers/artwork";
import { userRouter } from "./routers/user";
import { orderRouter } from "./routers/order";
import { wishlistRouter } from "./routers/wishlist";
import { cartRouter } from "./routers/cart";
import { dashboardRouter } from "./routers/dashboard";
import { forumRouter } from "./routers/forum";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  artwork: artworkRouter,
	event: eventRouter,
  user: userRouter,
  order: orderRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
  dashboard: dashboardRouter,
  forum: forumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
