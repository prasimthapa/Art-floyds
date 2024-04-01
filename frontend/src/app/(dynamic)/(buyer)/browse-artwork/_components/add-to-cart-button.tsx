"use client"

import { IconShoppingCart } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCart } from "~/stores/cart";
import { api } from "~/trpc/react";
import { type CartItem } from "~/xata";

type Props = { artworkId: string, artworkName: string }

export function AddToCartButton({ artworkId, artworkName }: Props) {
  const addToCart = api.cart.add.useMutation({
    onSuccess(data) {
      toast.success(`${artworkName} added to cart`)
      cart.add(data as CartItem)
    },
  })
  const cart = useCart()

  return <Button variant="ghost" className="rounded-full p-2" onClick={() => {
    addToCart.mutate(artworkId)
  }}>
    <IconShoppingCart className='w-6 h-6' />
  </Button>
}
