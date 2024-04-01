import { api } from "~/trpc/server";
import { OrdersTable } from "./_components/table";
import { fetchFromApi } from "~/lib/service";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export const dynamic = "force-dynamic"

export default async function Page() {
  const orders = await api.order.my.query()
	//
	// const orders = await fetchFromApi<inferProcedureOutput<AppRouter["order"]["my"]>>("order/my/")

  // @ts-expect-error xxx
  return <OrdersTable orders={orders} />
}
