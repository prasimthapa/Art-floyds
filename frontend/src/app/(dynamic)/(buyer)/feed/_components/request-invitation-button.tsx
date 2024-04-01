"use client"

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog"
import { type Event } from "~/xata";
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react";

export function RequestInvitationButton({ id }: Event) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const request = api.event.request.useMutation({
		onSuccess() {
			setOpen(false)
			router.refresh()
			toast.success('Requested successfully')
		},
		onError(error) {
			toast.error(JSON.stringify(error))
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full" variant="ghost">
					<ArrowLeftIcon className="mr-2 h-4 w-4" /> Request invitation
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Request invitation to event</DialogTitle>
					<DialogDescription>
						Fill in your details here. Click request when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
					const formData = new FormData(e.currentTarget)
					const email = formData.get("email") as string
					const phone = formData.get("phone") as string
					request.mutate({ email, phone, eventId: id })
				}}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input id="email" required type="email" name="email" placeholder="Email" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="phone" className="text-right">
								Phone
							</Label>
							<Input id="phone" name="phone" required type="tel" placeholder="Phone Number" className="col-span-3" />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Request</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
