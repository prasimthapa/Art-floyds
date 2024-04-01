import { api } from "~/trpc/server"
import { AreaChart } from '@tremor/react';
import { omit } from "lodash";
import { unstable_noStore } from "next/cache";
import { fetchFromApi } from "~/lib/service";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type Res = inferProcedureOutput<AppRouter["dashboard"]["analytics"]>

export default async function Page() {
  unstable_noStore()
  // const analytics = await api.dashboard.analytics.query()

  const analytics = await fetchFromApi<Res>("dashboard/analytics/")

  return <div className="flex flex-col items-center justify-center h-screen space-y-3 text-center">
    <Chart analytics={analytics} />
  </div>
}

function Chart({ analytics }: { analytics: Res }) {
  if (analytics.length === 0) return <h1 className="text-2xl">You do not have enough data for analytics.<br /> Please try again later</h1>
  const keys = Object.keys(omit(analytics.reduce((p, c) => ({ ...p, ...c })), "date"))
  return <AreaChart className="mt-4 h-72" data={analytics} index="date" yAxisWidth={65} categories={keys} />
}
