"use client"

import { IconEdit } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { type Artwork } from "~/xata";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import { Label } from "~/components/ui/label";
import { Input, type InputProps } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type FormEvent, useCallback, useState } from "react";
import { type inferProcedureInput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type UpdateArtwork = inferProcedureInput<AppRouter["artwork"]["update"]>

export function EditArtworkButton({ artwork: { id, price, name, size, style, category, availableQuantity } }: { artwork: Pick<Artwork, "id" | "price" | "name" | "size" | "category" | "availableQuantity" | "style"> }) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const utils = api.useUtils()
  const editArtwork = api.artwork.update.useMutation()

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as UpdateArtwork["name"]
    const size = formData.get("size") as UpdateArtwork["size"]
    const style = formData.get("style") as UpdateArtwork["style"]
    const category = formData.get("category") as UpdateArtwork["category"]
    const availableQuantity = parseInt((formData.get("availableQuantity") ?? "0") as string)
    const price = parseInt((formData.get("price") ?? "0") as string)
    // const image = formData.get("image") as File | undefined
    // const attachments = formData.getAll("secondaryAttachments") as File[] | undefined
    await editArtwork.mutateAsync({
      id,
      availableQuantity, price, category, name, size, style,
    })
    // await fetch(artwork.image!.uploadUrl, { method: 'PUT', body: image });
    //
    // for (const attachment of artwork.secondaryAttachments ?? []) {
    //   await fetch(attachment.uploadUrl, { method: 'PUT', body: image });
    // }
    setIsLoading(false)
    setOpen(false)
    await utils.artwork.my.invalidate()
    router.refresh()
  }, [editArtwork, id, router, utils.artwork.my])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <IconEdit />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit artwork</SheetTitle>
          <SheetDescription>
            Make changes to your artwork here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form className="w-full" onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <InputContainer required name="name" defaultValue={name ?? ""} placeholder="Mona Lisa" display="Name" />
            <InputContainer required name="size" defaultValue={size ?? ""} placeholder="32'" display="Size" />
            <InputContainer required name="style" defaultValue={style ?? ""} placeholder="cubism" display="Style" />
            <InputContainer required name="category" defaultValue={category ?? ""} placeholder="abstract" display="Category" />
            <InputContainer required name="availableQuantity" defaultValue={availableQuantity ?? ""} placeholder="2" type="number" display="Available Quantity" />
            <InputContainer required name="price" placeholder="1000" defaultValue={price ?? ""} type="number" display="Price" />
          </div>
          <SheetFooter>
            <Button className={isLoading ? "animate-bounce repeat-infinite" : undefined} disabled={isLoading} type="submit">
              Save changes
            </Button>
          </SheetFooter>
        </form >
      </SheetContent>
    </Sheet>
  )
}

function InputContainer({
  name, display, placeholder, className, ...rest
}: { name: string, display: string } & InputProps) {
  return <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={name} className="text-right">
      {display}
    </Label>
    <Input id={name} name={name} placeholder={placeholder} {...rest} className={cn("col-span-3", className)} />
  </div>
}
