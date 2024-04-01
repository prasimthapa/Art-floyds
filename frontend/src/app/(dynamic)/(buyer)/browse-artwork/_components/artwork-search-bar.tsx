"use client"

import { IconFilter } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation"
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input"

export function ArtworkSearchBar({ search, sort = '' }: { search?: string, sort?: string }) {
  const router = useRouter();
  const pathname = usePathname()

  return <div className="flex flex-row space-x-3">
    <Input type="search" className="block w-full p-4 ps-10 backdrop-blur-3xl opacity-70 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Browse Artist" defaultValue={search} onChange={async (e) => {
      router.replace(`${pathname}?${toSearchParams({ q: e.target.value, sort }).toString()}`)
    }} />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-4 backdrop-blur-3xl opacity-70 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"><IconFilter /> Sort</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort} onValueChange={(v) => {
          router.replace(`${pathname}?${toSearchParams({ q: search, sort: v }).toString()}`)
        }}>
          <DropdownMenuRadioItem value="">Default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-desc">Price (High to low)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-asc">Price (Low to high)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
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
