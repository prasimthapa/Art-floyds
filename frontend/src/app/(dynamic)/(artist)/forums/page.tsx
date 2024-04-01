import { api } from "~/trpc/server";
import { CreateForumButton } from "./_components/create-forum-button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { AnimatedTooltip } from "~/components/ui/animated-tooltip";
import { DeleteForumButton } from "./_components/delete-forum-button";
import { unstable_noStore } from "next/cache";
import { fetchFromApi } from "~/lib/service";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export default async function Page() {
  unstable_noStore()
  // const forums = await api.forum.all.query()

	const forums = await fetchFromApi<inferProcedureOutput<AppRouter["forum"]["all"]>>("forum/all/")

  return <div className="flex flex-col items-start space-y-8 mx-8 mb-16 mt-36 min-h-screen">
    <CreateForumButton />
    {
      forums.map(f => <div key={f.id} className="flex flex-row space-x-3 items-center">
        <Link href={`/forums/${f.id}`}>
          <Card key={f.id}>
            <CardHeader>
              <CardTitle className="flex flex-row space-x-3 items-center">
                <AnimatedTooltip className="scale-50" items={[
                  {
                    id: 1,
                    name: f.owner?.name ?? "",
                    designation: f.owner?.role ?? "",
                    image: f.owner?.image ?? '',
                  },
                ]} />
                <h1>{f.title}</h1>
              </CardTitle>
              <CardDescription>{f.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <DeleteForumButton forumId={f.id} />
      </div>)
    }
  </div>
}

