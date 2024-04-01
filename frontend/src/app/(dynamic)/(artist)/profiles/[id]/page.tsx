import { notFound } from "next/navigation"
import { AnimatedTooltip } from "~/components/ui/animated-tooltip"
import { ProfileArtworks } from "./_components/profile-artworks"
import { fetchFromApi } from "~/lib/service"
import { type inferProcedureOutput } from "@trpc/server"
import { type AppRouter } from "~/server/api/root"
import { api } from "~/trpc/server"
import { SocialMedias } from "./_components/social-medias"
import { unstable_noStore } from "next/cache"
import SuperJSON from "superjson"
import { getServerAuthSession } from "~/server/auth"
import { Bio } from "./_components/bio"

export default async function Page({ params: { id } }: { params: { id: string } }) {
  unstable_noStore()
  // const user = await api.user.withId.query(id)

  const user = await fetchFromApi<inferProcedureOutput<AppRouter["user"]["withId"]>>(`user/withId/?id=${id}`)

  if (!user?.id) return notFound()

  const socialMedias = await api.user.socialMediasOf.query(user.id)
  const session = await getServerAuthSession()
  const hasPerm = user.id === session?.user.id

  return <div className="flex flex-col space-y-4">
    <div className="bg-gradient-to-r from-red-300 relative to-purple-300 h-[20vh] m-8 rounded-xl">
      <AnimatedTooltip className="absolute bottom-3 left-[48%] scale-[3]" items={[
        {
          id: 1,
          name: user.name ?? "",
          designation: user.role,
          image: user.image ?? '',
        },
      ]} />
    </div>
    <Bio bio={user.bio ?? `I am a ${user.role}`} canEdit={hasPerm} />
    {socialMedias && <SocialMedias canAdd={hasPerm} socialMedias={SuperJSON.stringify(socialMedias)} />}
    {
      // @ts-expect-error xxx
      <ProfileArtworks user={user} />
    }
  </div>
}
