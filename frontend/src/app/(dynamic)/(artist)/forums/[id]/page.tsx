import { AnimatedTooltip } from "~/components/ui/animated-tooltip"
import { AddForumReplyButton } from "./_components/add-forum-reply-button"

import { BackButton } from "~/components/ui/back-button"
import { fetchFromApi } from "~/lib/service"
import { type inferProcedureOutput } from "@trpc/server"
import { type AppRouter } from "~/server/api/root"
import { ForumReplies } from "./_components/forum-replies"

export type ForumDetail = inferProcedureOutput<AppRouter["forum"]["byId"]>

export default async function Page({ params: { id } }: { params: { id: string } }) {
  // const { id: fId, title, description, owner, xata: { createdAt }, replies } = await api.forum.byId.query(id)

  const { id: fId, title, description, owner, xata: { createdAt }, replies } = await fetchFromApi<ForumDetail>(`forum/byId/?id=${id}`)

  return <div className="flex flex-col justify-start items-start space-y-2 h-screen pt-32 px-8">
    <div className="flex flex-row items-center space-x-3">
      <BackButton />
      <AnimatedTooltip className="scale-50" items={[
        {
          id: 1,
          name: owner?.name ?? "",
          designation: "",
          image: owner?.image ?? '',
        },
      ]} />
      <h1 className="font-bold text-3xl">{title}</h1>
      <h4 className="opacity-40">Asked on {new Date(createdAt).toISOString().substring(0, 10)}</h4>
    </div>
    <h3>{description}</h3>
    <section className="py-12">
      <AddForumReplyButton forumId={fId} />
    </section>
    <section className="flex flex-col items-start justify-start space-y-4">
      <h1 className="font-bold text-2xl pb-8">Answers</h1>
      <ForumReplies replies={replies} chatId={fId}/>
    </section>
  </div>
}
