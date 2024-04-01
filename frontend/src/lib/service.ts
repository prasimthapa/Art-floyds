"use server"

import { env } from "~/env"
import { getServerAuthSession } from "~/server/auth"

export async function fetchFromApi<T>(input: string, init?: RequestInit): Promise<T> {
  const user = await getServerAuthSession()

  const res = await fetch(`${env.API_BASE_URL}/${input}`, {
    ...init,
    headers: {
			...init?.headers,
      "Authorization": `Bearer ${user?.user.id}`,
    },
  })

  return res.json() as Promise<T>
}
