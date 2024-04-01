"use client"

import { useEffect, useState } from "react";
import { type ForumDetail } from "../page";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { AnimatedTooltip } from "~/components/ui/animated-tooltip";
import { DeleteForumReplyButton } from "./delete-forum-reply-button";
import { useSession } from "next-auth/react";
import { pusherClient } from "~/server/pusher-client";

type Single<T> = T extends Array<infer U> ? U : never

type Reply = Single<ForumDetail["replies"]>

export function ForumReplies({ replies: _replies, chatId }: { replies: Reply[], chatId: string }) {
  const user = useSession().data?.user
  const [replies, setReplies] = useState(_replies)

  useEffect(() => {
    const channel = pusherClient.subscribe(`chat-${chatId}`)
    channel.bind("reply", (reply: Reply) => {
      setReplies(r => [...new Set([reply, ...r])])
    })
    channel.bind("delete-reply", (replyId: string) => {
      console.log("drc")
      setReplies(r => r.filter(({ id }) => id !== replyId))
    })
    return () => channel.unsubscribe()
  }, [chatId])

  return replies.map(r => <Card key={r.id}>
    <CardHeader className="flex flex-row items-start space-x-3">
      <CardTitle className="flex flex-row skew-x-2 items-start justify-start mx-3">
        <AnimatedTooltip items={[
          {
            id: 1,
            name: r.sender?.name ?? "",
            designation: r.sender?.role ?? "",
            image: r.sender?.image ?? "",
          },
        ]} />
      </CardTitle>
      <div className="relative">
        {r.sender?.id === user?.id && <DeleteForumReplyButton replyId={r.id} />}
        <div className="flex flex-col space-y-2">
          <CardDescription>{r.message}</CardDescription>
          <CardDescription className="opacity-40">
            Answered on {new Date(r.xata.createdAt).toISOString().substring(0, 10)}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  </Card>)
}
