import { DirectionAwareHover } from "~/components/ui/direction-aware-hover";
import { ArtworkSearchBar } from "./_components/artwork-search-bar";
import { AddToWishlistButton } from "./_components/add-to-wishlist-button";
import { AddToCartButton } from "./_components/add-to-cart-button";
import { fetchFromApi } from "~/lib/service";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import Link from "next/link";
import clsx from "clsx";

export default async function Page({ searchParams: { q, sort, style } = {} }: { searchParams?: { q?: string, sort?: string, style?: string } }) {
  // const artworks = await api.artwork.search.query(searchParams.q)

  const searchMap = { q, sort, style };
  const search = toSearchParams(searchMap)

  let artworks = await fetchFromApi<inferProcedureOutput<AppRouter["artwork"]["search"]>>(`artwork/search/?${search.toString()}`)

  const categories = [...new Set(artworks.map(a => a.style).filter(a => !!a))]

  artworks = !style ? artworks : artworks.filter(a => a.style === style)

  return <div className="relative w-full pt-36">
    <div className="sticky z-10 ml-auto pr-4 top-20 w-96 flex flex-row space-x-3 justify-end items-center">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <ArtworkSearchBar search={q} sort={sort} />
      </div>
    </div>
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col items-start justify-start gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full">
        <h1 className="text-3xl font-semibold">Categories</h1>
      </div>
      <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link href={`/browse-artwork?${toSearchParams({ ...searchMap, style: undefined }).toString()}`} key={"all"} className={clsx({ "font-semibold text-primary": !style })}>
            All
          </Link>
          {categories.map(c => <>{
            <Link href={`/browse-artwork?${toSearchParams({ ...searchMap, style: c }).toString()}`} key={c} className={clsx({ "font-semibold text-primary": c === style })}>
              {c}
            </Link>
          }</>)}
        </nav>
        <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto justify-items-center">{
          artworks?.map((artwork) => {
            const { name, id, image, style, size, price, isInWishlist } = artwork
            return <DirectionAwareHover key={id} imageUrl={image?.url ?? ''}>
              <p className="font-bold text-xl">{name}</p>
              <p className="font-normal text-sm">{size} | {style} | {price}$</p>
              <div className="flex flex-row skew-x-2 pt-4 justify-between">
                <AddToWishlistButton {...{ isInWishlist, id }} />
                <AddToCartButton artworkId={artwork.id} artworkName={artwork.name ?? ''} />
              </div>
            </DirectionAwareHover>
          })
        }</div>
      </div>
    </main >
  </div >
}

function toSearchParams(record: Record<string, string | null | undefined>): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(record)) {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value);
    }
  }

  return searchParams;
}
