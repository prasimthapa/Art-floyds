import { DirectionAwareHover } from "~/components/ui/direction-aware-hover";
import { api } from "~/trpc/server"
import { AddArtworkButton } from "./_components/add-artwork-button";
import { EditArtworkButton } from "./_components/edit-artwork-button";
import { fetchFromApi } from "~/lib/service";
import { type AppRouter } from "~/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

export const dynamic = "force-dynamic"

export default async function Page() {
  // const artworks = await api.artwork.my.query()

	const artworks = await fetchFromApi<inferProcedureOutput<AppRouter["artwork"]["my"]>>("artwork/my/")

  return <div className="relative w-full pt-36">
    <div className="sticky z-10 ml-auto pr-4 top-20 w-96 flex flex-row space-x-3 justify-end items-center">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
      </div>
    </div>
    <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto justify-items-center">
      <AddArtworkButton />
      {
        artworks?.map((artwork) => {
          const { name, id, image, style, size, price, availableQuantity, category } = artwork
          return <DirectionAwareHover key={id} imageUrl={image?.url ?? ''}>
            <div className="flex flex-col items-start space-y-2">
              {
                <EditArtworkButton artwork={{ id, name, price, style, size, category, availableQuantity }} />
              }
              <div className="flex flex-row space-x-4 items-end">
                <p className="font-bold text-xl">{name}</p>
                <p className="font-normal text-sm">{size} | {style} | {price}$</p>
              </div>
            </div>
          </DirectionAwareHover>
        })
      }
    </div>
  </div>
}
