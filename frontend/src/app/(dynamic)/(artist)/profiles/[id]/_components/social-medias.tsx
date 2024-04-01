"use client"

import { type inferProcedureOutput } from "@trpc/server"
import SuperJSON from "superjson"
import { type AppRouter } from "~/server/api/root"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { api } from "~/trpc/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import clsx from "clsx"

type Params = { socialMedias: string, canAdd: boolean }
type SocialMedias = inferProcedureOutput<AppRouter['user']['socialMediasOf']>

export function SocialMedias({ socialMedias: s, canAdd }: Params) {
  const { socialMedias, userSocialMedia } = SuperJSON.parse<SocialMedias>(s)
  return <div className="flex flex-row items-center justify-center space-x-3">
    {userSocialMedia.map(({ socialMedia, link }) => (socialMedia?.icon?.url &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      <Link key={socialMedia.id} href={link ?? ''}>
        <Image className="size-12 hover:border-blue-400 transition-all hover:-translate-y-1 hover:translate-x-1 rounded-full border border-gray-50 shadow-2xl" alt="" width={36} height={36} src={socialMedia.icon.url} />
      </Link>
    ))}
    {canAdd && <AddSocialMedia socialMedias={socialMedias} />}
  </div>
}

function AddSocialMedia({ socialMedias }: { socialMedias: SocialMedias['socialMedias'] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const addSocialMedia = api.user.addSocialMedia.useMutation({
    onSuccess() {
      setOpen(false)
      router.refresh()
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full p-2">
          <IconPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add social media</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          const formData = new FormData(e.currentTarget)
          const link = formData.get('link') as string
          const socialMedia = formData.get("socialMedia") as string
          addSocialMedia.mutate({ link, socialMedia })
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select name="socialMedia" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a social media" />
                </SelectTrigger>
                <SelectContent>
                  {socialMedias.map(({ name, id, icon }) => <SelectItem value={id} key={id}>
                    <div className="flex flex-row space-x-1">
                      <Image className="size-4" src={icon?.url ?? ''} width={4} height={4} alt="" />
                      <h1>{name}</h1>
                    </div>
                  </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input id="link" type="url" name="link" required className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={addSocialMedia.isLoading} className={clsx({ "animate-bounce": addSocialMedia.isLoading })} type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
