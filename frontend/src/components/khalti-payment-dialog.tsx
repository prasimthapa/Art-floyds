"use client"

import { useMutation } from "@tanstack/react-query"
import { type FormEvent, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { initiatePayment, showCheckout } from "~/lib/payment"
import { useCart } from "~/stores/cart"
import { api } from "~/trpc/react"

const randomUUID = () => `${Math.random() * 100}`

export function KhaltiPaymentDialog({ total }: { total: number }) {
  const cart = useCart()
  // const initiateMutation = useMutation({
  //   mutationFn: (formData: FormData) => {
  //     return initiatePayment({
  //       return_url: window.location.origin,
  //       purchase_order_id: randomUUID(),
  //       purchase_order_name: randomUUID(),
  //     })
  //   },
  //   onError: (e) => toast.error(e as string)
  // })
  //
  // const initiate = useCallback(async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   const formData = new FormData(e.currentTarget)
  //
  //   initiateMutation.mutate(formData)
  // }, [initiateMutation])

  const clearCart = api.cart.clear.useMutation()
  const createOrders = api.order.create.useMutation()

  return <Button onClick={() => showCheckout({
    amount: total,
    onError: (e) => toast.error(e as string),
    onSuccess: () => {
      toast.success(`Payment of Rs.${total} completed`)
      cart.clear()
      createOrders.mutate(cart.items.map(c => c.artwork!))
      clearCart.mutate()
    },
  })}>Pay ${total}</Button>
  // return (
  //   <Dialog>
  //     <DialogTrigger asChild>
  //       <Button>Pay ${total}</Button>
  //     </DialogTrigger>
  //     <DialogContent className="sm:max-w-[425px]">
  //       <form onSubmit={initiate}>
  //         <DialogHeader>
  //           <DialogTitle>Khalti</DialogTitle>
  //         </DialogHeader>
  //         <div className="grid gap-4 py-4">
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label htmlFor="mobile" className="text-right">
  //               Mobile Number
  //             </Label>
  //             <Input required id="mobile" type="tel" className="col-span-3" name="mobile" />
  //           </div>
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label htmlFor="transaction_pin" className="text-right">
  //               Khalti Pin
  //             </Label>
  //             <Input required id="transaction_pin" type="password" className="col-span-3" name="transaction_pin" />
  //           </div>
  //         </div>
  //         <DialogFooter>
  //           <Button type="submit">Pay Rs.{total}</Button>
  //         </DialogFooter>
  //       </form>
  //     </DialogContent>
  //   </Dialog>
  // )
}
// {"product_identity":"83.52644904280764","transaction_pin":"1234","amount":50,"mobile":"9800000004","product_url":"localhost:3000/21.150378509053336","product_name":"80.71605179904427","public_key":"test_public_key_12c2d568c03840cbae65ba9a318b5199"}
//{"public_key":"test_public_key_12c2d568c03840cbae65ba9a318b5199","product_identity":"1234567890","product_name":"Drogon","amount":5000,"transaction_pin":"1234","mobile":"9800000004","product_url":"http://gameofthrones.com/buy/Dragons","widgetId":"khalti-widget-1711259845066","source":"checkout_v2.1"}
