"use client"

import { IconArrowDown } from "@tabler/icons-react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DatePickerWithPresets } from "~/components/preset-date-picker"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { api } from "~/trpc/react"

export function AddEventButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()

  useEffect(() => setDate(undefined), [open])

  const createEvent = api.event.create.useMutation({
    onSuccess() {
      setOpen(false)
      router.refresh()
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Add new event
          <IconArrowDown className="size-4 ml-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          if (!date) return toast.error('Date is required', { position: 'top-center' })
          const formData = new FormData(e.currentTarget)
          const location = formData.get("location") as string
          const name = formData.get("name") as string
          const description = formData.get("description") as string | undefined
          createEvent.mutate({ location, dateTime: date, name, description })
        }}>
          <DialogHeader>
            <DialogTitle>Post Event</DialogTitle>
            <DialogDescription>
              Set your event to post
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Date
              </Label>
              <DatePickerWithPresets date={date} onDateChange={setDate} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input required placeholder="Event name" id="name" name="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input required placeholder="where is the event?" id="location" name="location" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea placeholder="about event (optional)" id="description" name="description" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createEvent.isLoading} className={clsx({
							"animate-bounce": createEvent.isLoading,
						})}>Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
