"use client"

import { useRouter } from "next/navigation"
import { Button } from "./button"
import { IconArrowBack } from "@tabler/icons-react"

export function BackButton({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return <Button variant="link" className="dark:text-white text-black" onClick={() => router.back()}>
    <IconArrowBack />
    {children}
  </Button>
}
