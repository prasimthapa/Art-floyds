"use client"

import { DialogTrigger } from "@radix-ui/react-dialog";
import { IconDeviceMobileMessage } from "@tabler/icons-react";
import { type inferProcedureInput } from "@trpc/server";
import clsx from "clsx";
import { type FormEvent, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type Reply = inferProcedureInput<AppRouter["forum"]["reply"]>["message"]

export function AddForumReplyButton({ forumId }: { forumId: string }) {
  const [open, setOpen] = useState(false)

  const replyMutation = api.forum.reply.useMutation({
    async onSuccess() {
      setOpen(false)
    }
  })

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const formData = new FormData(e.currentTarget)

    const message = formData.get("answer") as Reply

    replyMutation.mutate({ chatId: forumId, message })
  }, [forumId, replyMutation])

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button className="flex flex-row space-x-3">
        <h3>Add your answer</h3>
        <IconDeviceMobileMessage />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add dialog</DialogTitle>
        <DialogDescription>
          Add your answer here. Click answer when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="answer" className="text-right">
              Answer
            </Label>
            <Textarea required id="answer" name="answer" placeholder="describe your answer" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={replyMutation.isLoading} className={clsx({ "animate-bounce repeat-infinite": replyMutation.isLoading })}>
            Answer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
}
