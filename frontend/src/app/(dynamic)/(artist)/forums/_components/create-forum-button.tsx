"use client"

import { IconForms } from "@tabler/icons-react";
import { type inferProcedureInput } from "@trpc/server";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type Create = inferProcedureInput<AppRouter["forum"]["create"]>

export function CreateForumButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const utils = api.useUtils()
  const createForum = api.forum.create.useMutation({
    async onSuccess() {
      setOpen(false)
      await utils.forum.all.invalidate()
      router.refresh()
    },
  })

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)

    const title = formData.get("title") as Create["title"]
    const description = formData.get("description") as Create["description"]

    createForum.mutate({ title, description })
  }, [createForum])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-row space-x-2 text-lg">
          <h1>Start a new forum</h1>
          <IconForms />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a new forum</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Question
              </Label>
              <Input id="title" name="title" required placeholder="ask a question" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" placeholder="describe your question" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createForum.isLoading} className={clsx({ "animate-bounce repeat-infinite": createForum.isLoading })}>
              Ask
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
