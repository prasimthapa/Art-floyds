"use client"

import { IconHeartFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export type AddToWishlistButtonProps = {
  isInWishlist: boolean;
  id: string;
}

export function AddToWishlistButton({ id, isInWishlist }: AddToWishlistButtonProps) {
  const router = useRouter()
  const utils = api.useUtils()
  const [isFav, setIsFav] = useState(isInWishlist)

  const addMutation = api.wishlist.add.useMutation({
    async onSuccess() {
      void utils.wishlist.search.invalidate()
      if (!isFav) router.refresh()
    }
  })
  const removeMutation = api.wishlist.remove.useMutation({
    async onSuccess() {
      void utils.wishlist.search.invalidate()
      if (!isFav) router.refresh()
    }
  })

  return <Button variant="ghost" className="rounded-full p-2" onClick={() => {
    if (isFav) removeMutation.mutate(id, { onSuccess: () => setIsFav(false) })
    else addMutation.mutate(id, { onSuccess: () => setIsFav(true) })
  }}>
    <IconHeartFilled className={`w-6 h-6 transition-all duration-200 ${isFav && "text-red-400"}`} />
  </Button>
}
