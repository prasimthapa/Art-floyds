import { DirectionAwareHover } from "~/components/ui/direction-aware-hover"
import { api } from "~/trpc/server"
import { AddToWishlistButton } from "../browse-artwork/_components/add-to-wishlist-button"
import { ArtworkSearchBar } from "../browse-artwork/_components/artwork-search-bar"
import { IconShoppingCart } from "@tabler/icons-react"
import { Button } from "~/components/ui/button"
import { fetchFromApi } from "~/lib/service"
import { type inferProcedureOutput } from "@trpc/server"
import { type AppRouter } from "~/server/api/root"

export default async function Page({ searchParams }: { searchParams: { q?: string, sort?: string } }) {
  // const artworks = await api.wishlist.search.query(searchParams.q)

  const artworks = await fetchFromApi<inferProcedureOutput<AppRouter["wishlist"]["search"]>>(`wishlist/search/?q=${searchParams?.q ?? ''}`)

  return <div className="relative w-full pt-36">
    <div className="sticky z-10 ml-auto pr-4 top-20 w-96 flex flex-row space-x-3 justify-end items-center">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <ArtworkSearchBar search={searchParams.q} sort={searchParams.sort} />
      </div>
    </div>
    <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto justify-items-center">{
      artworks.map(({ name, id, image, style, size, price }) => {
        return <DirectionAwareHover key={id} imageUrl={image?.url ?? ''}>
          <p className="font-bold text-xl">{name}</p>
          <p className="font-normal text-sm">{size} | {style} | {price}$</p>
          <div className="flex flex-row skew-x-2 pt-4 justify-between">
            <AddToWishlistButton {...{ isInWishlist: true, id }} />
            <Button variant="ghost" className="rounded-full p-2">
              <IconShoppingCart className='w-6 h-6' />
            </Button>
          </div>
        </DirectionAwareHover>
      })
    }</div>
  </div>
}
