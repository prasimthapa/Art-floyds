import { type inferProcedureOutput } from "@trpc/server";
import { unstable_noStore as noStore } from "next/cache";
import { HeroParallax } from "~/components/ui/hero-parallax";
import { fetchFromApi } from "~/lib/service";
import { type AppRouter } from "~/server/api/root";

import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  // const session = await getServerAuthSession();

  // const products = await api.artwork.all.query({ limit: 15 });

  const products = await fetchFromApi<inferProcedureOutput<AppRouter["artwork"]["all"]>>("artwork/all/?limit=15")

  return (
    <main>
      <HeroParallax products={products.map(({ name, image, id }) => ({ title: name ?? '', thumbnail: image?.url ?? '', link: `browse-artwork/${id}` }))} />
    </main>
  );
}
