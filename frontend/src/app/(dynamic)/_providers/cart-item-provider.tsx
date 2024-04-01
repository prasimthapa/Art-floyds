"use client"

import { useEffect } from "react";
import { useCart } from "~/stores/cart";
import { api } from "~/trpc/react"

export function CartItemProvider({ children }: React.PropsWithChildren) {
  const cart = useCart()
  const { data } = api.cart.get.useQuery();
  useEffect(() => {
		// @ts-expect-error xxx
    if (data) cart.setItems(data)
  }, [data])

  return children;
}
