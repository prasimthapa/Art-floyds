import create from "zustand-store-addons"
import { type CartItem } from "~/xata"

export type CartProps = {
  items: CartItem[]
  setItems: (items: CartItem[]) => void
  clear: () => void
  add: (item: CartItem) => void
  remove: (artworkId: string) => void
  total: number
  count: number
}

export const useCart = create<CartProps>(
  (set) => {
    return {
      items: [],
      clear: () => set({ items: [] }),
      add: (cartItem) => {
        set(({ items }) => {
          const newItems = [...items, cartItem]
          return {
            items: newItems,
          }
        })
      },
      remove: (artworkId) => {
        set(({ items }) => {
          const newItems = items.filter(c => c.artwork?.id !== artworkId)
          return {
            items: newItems,
          }
        })
      },
      setItems: (items) => set({ items }),
      total: 0,
      count: 0,
    }
  },
  {
    computed: {
      count() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return this.items.length
      },
      total() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        const items: number[] = this.items.map((i: CartItem) => i.artwork?.price ?? 0)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return items.length === 0 ? 0 : items.reduce((p, n) => p + n)
      }
    },
  }
)
